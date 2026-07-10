import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type InvitePayload = {
  email: string;
  fullName: string;
  role: "admin" | "teacher" | "student";
  phone?: string | null;
  guardianName?: string | null;
  marketingOptIn?: boolean;
  marketingSource?: string | null;
  groupIds?: string[];
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function normalizePayload(payload: Partial<InvitePayload>): InvitePayload {
  const email = payload.email?.trim().toLowerCase();
  const fullName = payload.fullName?.trim();
  const role = payload.role;

  if (!email || !email.includes("@")) {
    throw new Error("Informe um e-mail valido.");
  }

  if (!fullName) {
    throw new Error("Informe o nome completo.");
  }

  if (!role || !["admin", "teacher", "student"].includes(role)) {
    throw new Error("Perfil invalido.");
  }

  return {
    email,
    fullName,
    role,
    phone: payload.phone?.trim() || null,
    guardianName: payload.guardianName?.trim() || null,
    marketingOptIn: Boolean(payload.marketingOptIn),
    marketingSource: payload.marketingSource?.trim() || "portal-invite",
    groupIds: Array.from(new Set(payload.groupIds ?? [])).filter(Boolean),
  };
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = requireEnv("SUPABASE_URL");
    const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    const siteUrl = (Deno.env.get("SITE_URL") ?? "https://madsmusicalproject.com").replace(
      /\/$/,
      "",
    );
    const authorization = request.headers.get("Authorization") ?? "";
    const jwt = authorization.replace("Bearer ", "");

    if (!jwt) {
      return json({ error: "Sessao obrigatoria." }, 401);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      data: { user: caller },
      error: callerError,
    } = await serviceClient.auth.getUser(jwt);

    if (callerError || !caller) {
      return json({ error: "Sessao invalida." }, 401);
    }

    const { data: adminProfile, error: adminError } = await serviceClient
      .from("profiles")
      .select("role, active")
      .eq("id", caller.id)
      .maybeSingle();

    if (adminError) {
      return json({ error: adminError.message }, 500);
    }

    if (adminProfile?.role !== "admin" || !adminProfile.active) {
      return json({ error: "Apenas administradores ativos podem convidar usuarios." }, 403);
    }

    const payload = normalizePayload(await request.json());

    let invitedUserId: string | null = null;
    const { data: inviteData, error: inviteError } =
      await serviceClient.auth.admin.inviteUserByEmail(payload.email, {
        redirectTo: `${siteUrl}/portal/`,
        data: {
          full_name: payload.fullName,
          role: payload.role,
        },
      });

    if (inviteData.user?.id) {
      invitedUserId = inviteData.user.id;
    }

    if (inviteError && !invitedUserId) {
      const { data: existingUsers, error: listError } =
        await serviceClient.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });

      if (listError) {
        return json({ error: inviteError.message }, 400);
      }

      const existing = existingUsers.users.find(
        (user) => user.email?.toLowerCase() === payload.email,
      );

      if (!existing) {
        return json({ error: inviteError.message }, 400);
      }

      invitedUserId = existing.id;
    }

    if (!invitedUserId) {
      return json({ error: "Nao foi possivel criar o usuario." }, 400);
    }

    const now = new Date().toISOString();
    const { error: profileError } = await serviceClient.from("profiles").upsert({
      id: invitedUserId,
      email: payload.email,
      full_name: payload.fullName,
      role: payload.role,
      phone: payload.phone,
      guardian_name: payload.guardianName,
      active: true,
      marketing_opt_in: payload.marketingOptIn,
      marketing_opt_in_at: payload.marketingOptIn ? now : null,
      marketing_source: payload.marketingSource,
    });

    if (profileError) {
      return json({ error: profileError.message }, 500);
    }

    if (payload.groupIds.length > 0 && payload.role !== "admin") {
      const membershipRole = payload.role === "teacher" ? "teacher" : "student";
      const { error: membershipError } = await serviceClient
        .from("group_memberships")
        .upsert(
          payload.groupIds.map((groupId) => ({
            profile_id: invitedUserId,
            group_id: groupId,
            role: membershipRole,
          })),
          { onConflict: "group_id,profile_id" },
        );

      if (membershipError) {
        return json({ error: membershipError.message }, 500);
      }
    }

    return json({
      ok: true,
      userId: invitedUserId,
      email: payload.email,
      role: payload.role,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return json({ error: message }, 500);
  }
});
