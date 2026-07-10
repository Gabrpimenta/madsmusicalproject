export type UserRole = "admin" | "teacher" | "student";
export type MembershipRole = "teacher" | "student";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  guardian_name: string | null;
  active: boolean;
  marketing_opt_in: boolean;
  marketing_opt_in_at: string | null;
  marketing_source: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CourseGroup = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type GroupMembership = {
  id: string;
  group_id: string;
  profile_id: string;
  role: MembershipRole;
  created_at: string;
};

export type PortalFile = {
  id: string;
  group_id: string;
  uploaded_by: string;
  title: string;
  description: string | null;
  category: string | null;
  storage_path: string;
  original_name: string;
  mime_type: string | null;
  size_bytes: number;
  visible_from: string | null;
  archived_at: string | null;
  active: boolean;
  created_at: string;
  course_groups?: Pick<CourseGroup, "name"> | null;
};

export type PortalSetting = {
  key: string;
  value: string;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> &
          Pick<Profile, "id" | "email" | "full_name" | "role">;
        Update: Partial<Profile>;
        Relationships: [];
      };
      course_groups: {
        Row: CourseGroup;
        Insert: Partial<CourseGroup> & Pick<CourseGroup, "name">;
        Update: Partial<CourseGroup>;
        Relationships: [];
      };
      group_memberships: {
        Row: GroupMembership;
        Insert: Partial<GroupMembership> &
          Pick<GroupMembership, "group_id" | "profile_id" | "role">;
        Update: Partial<GroupMembership>;
        Relationships: [];
      };
      portal_files: {
        Row: PortalFile;
        Insert: Partial<PortalFile> &
          Pick<
            PortalFile,
            | "group_id"
            | "uploaded_by"
            | "title"
            | "storage_path"
            | "original_name"
            | "size_bytes"
          >;
        Update: Partial<PortalFile>;
        Relationships: [];
      };
      portal_settings: {
        Row: PortalSetting;
        Insert: Partial<PortalSetting> & Pick<PortalSetting, "key" | "value">;
        Update: Partial<PortalSetting>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
