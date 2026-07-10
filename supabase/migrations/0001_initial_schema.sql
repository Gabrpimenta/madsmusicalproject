create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('admin', 'teacher', 'student')),
  phone text,
  guardian_name text,
  active boolean not null default true,
  marketing_opt_in boolean not null default false,
  marketing_opt_in_at timestamptz,
  marketing_source text,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.course_groups(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('teacher', 'student')),
  created_at timestamptz not null default now(),
  unique (group_id, profile_id)
);

create table if not exists public.portal_files (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.course_groups(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  description text,
  category text,
  storage_path text not null unique,
  original_name text not null,
  mime_type text,
  size_bytes bigint not null check (size_bytes >= 0),
  visible_from timestamptz,
  archived_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_settings (
  key text primary key,
  value text not null,
  description text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.portal_settings (key, value, description)
values
  ('max_upload_bytes', '10485760', 'Default app upload limit: 10 MB per file.'),
  ('storage_budget_bytes', '1073741824', 'Free-first storage budget: 1 GB.')
on conflict (key) do nothing;

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_group_memberships_profile on public.group_memberships(profile_id);
create index if not exists idx_group_memberships_group on public.group_memberships(group_id);
create index if not exists idx_portal_files_group on public.portal_files(group_id);
create index if not exists idx_portal_files_uploaded_by on public.portal_files(uploaded_by);
create index if not exists idx_portal_files_active on public.portal_files(active, archived_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_course_groups_updated_at on public.course_groups;
create trigger set_course_groups_updated_at
before update on public.course_groups
for each row execute function public.set_updated_at();

drop trigger if exists set_portal_settings_updated_at on public.portal_settings;
create trigger set_portal_settings_updated_at
before update on public.portal_settings
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and active = true
  limit 1
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin'
$$;

create or replace function public.is_group_member(target_group_id uuid, target_role text default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_memberships gm
    join public.profiles p on p.id = gm.profile_id
    where gm.group_id = target_group_id
      and gm.profile_id = auth.uid()
      and p.active = true
      and (target_role is null or gm.role = target_role)
  )
$$;

create or replace function public.portal_storage_group_id(object_name text)
returns uuid
language plpgsql
immutable
as $$
declare
  first_folder text;
begin
  first_folder := split_part(object_name, '/', 1);
  return first_folder::uuid;
exception
  when others then
    return null;
end;
$$;

alter table public.profiles enable row level security;
alter table public.course_groups enable row level security;
alter table public.group_memberships enable row level security;
alter table public.portal_files enable row level security;
alter table public.portal_settings enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "course_groups_select_members" on public.course_groups;
create policy "course_groups_select_members"
on public.course_groups
for select
to authenticated
using (public.is_admin() or public.is_group_member(id));

drop policy if exists "course_groups_admin_insert" on public.course_groups;
create policy "course_groups_admin_insert"
on public.course_groups
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "course_groups_admin_update" on public.course_groups;
create policy "course_groups_admin_update"
on public.course_groups
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "group_memberships_select_self_or_admin" on public.group_memberships;
create policy "group_memberships_select_self_or_admin"
on public.group_memberships
for select
to authenticated
using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "group_memberships_admin_insert" on public.group_memberships;
create policy "group_memberships_admin_insert"
on public.group_memberships
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "group_memberships_admin_update" on public.group_memberships;
create policy "group_memberships_admin_update"
on public.group_memberships
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "group_memberships_admin_delete" on public.group_memberships;
create policy "group_memberships_admin_delete"
on public.group_memberships
for delete
to authenticated
using (public.is_admin());

drop policy if exists "portal_files_select_by_role" on public.portal_files;
create policy "portal_files_select_by_role"
on public.portal_files
for select
to authenticated
using (
  public.is_admin()
  or public.is_group_member(group_id, 'teacher')
  or (
    active = true
    and archived_at is null
    and (visible_from is null or visible_from <= now())
    and public.is_group_member(group_id, 'student')
  )
);

drop policy if exists "portal_files_insert_teacher_or_admin" on public.portal_files;
create policy "portal_files_insert_teacher_or_admin"
on public.portal_files
for insert
to authenticated
with check (
  uploaded_by = auth.uid()
  and (public.is_admin() or public.is_group_member(group_id, 'teacher'))
);

drop policy if exists "portal_files_update_teacher_or_admin" on public.portal_files;
create policy "portal_files_update_teacher_or_admin"
on public.portal_files
for update
to authenticated
using (public.is_admin() or public.is_group_member(group_id, 'teacher'))
with check (public.is_admin() or public.is_group_member(group_id, 'teacher'));

drop policy if exists "portal_files_delete_teacher_or_admin" on public.portal_files;
create policy "portal_files_delete_teacher_or_admin"
on public.portal_files
for delete
to authenticated
using (
  public.is_admin()
  or (uploaded_by = auth.uid() and public.is_group_member(group_id, 'teacher'))
);

drop policy if exists "portal_settings_select_authenticated" on public.portal_settings;
create policy "portal_settings_select_authenticated"
on public.portal_settings
for select
to authenticated
using (true);

drop policy if exists "portal_settings_admin_update" on public.portal_settings;
create policy "portal_settings_admin_update"
on public.portal_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit)
values ('portal-files', 'portal-files', false, 26214400)
on conflict (id) do update
set public = false,
    file_size_limit = 26214400;

drop policy if exists "portal_storage_select_by_file_policy" on storage.objects;
create policy "portal_storage_select_by_file_policy"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'portal-files'
  and exists (
    select 1
    from public.portal_files pf
    where pf.storage_path = storage.objects.name
      and (
        public.is_admin()
        or public.is_group_member(pf.group_id, 'teacher')
        or (
          pf.active = true
          and pf.archived_at is null
          and (pf.visible_from is null or pf.visible_from <= now())
          and public.is_group_member(pf.group_id, 'student')
        )
      )
  )
);

drop policy if exists "portal_storage_insert_teacher_or_admin" on storage.objects;
create policy "portal_storage_insert_teacher_or_admin"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portal-files'
  and (
    public.is_admin()
    or public.is_group_member(public.portal_storage_group_id(storage.objects.name), 'teacher')
  )
);

drop policy if exists "portal_storage_update_teacher_or_admin" on storage.objects;
create policy "portal_storage_update_teacher_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portal-files'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.portal_files pf
      where pf.storage_path = storage.objects.name
        and pf.uploaded_by = auth.uid()
        and public.is_group_member(pf.group_id, 'teacher')
    )
  )
)
with check (
  bucket_id = 'portal-files'
  and (
    public.is_admin()
    or public.is_group_member(public.portal_storage_group_id(storage.objects.name), 'teacher')
  )
);

drop policy if exists "portal_storage_delete_teacher_or_admin" on storage.objects;
create policy "portal_storage_delete_teacher_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portal-files'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.portal_files pf
      where pf.storage_path = storage.objects.name
        and pf.uploaded_by = auth.uid()
        and public.is_group_member(pf.group_id, 'teacher')
    )
  )
);
