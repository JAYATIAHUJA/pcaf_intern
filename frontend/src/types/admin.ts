export interface Role {
  id: number;
  name: string;
  color: string;
  desc: string;
  users: number;
}

export interface CreateRoleForm {
  name: string;
  desc: string;
  color: string;
}

export type PermissionMatrix = Record<string, string[]>;

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  roleId: number;
  status: string;
}

export interface UserRow {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: string;
  roleClass: string;
  status: string;
  lastLogin: string;
  dept: string;
}

export interface AddUserForm {
  name: string;
  email: string;
  roleId: string;
}