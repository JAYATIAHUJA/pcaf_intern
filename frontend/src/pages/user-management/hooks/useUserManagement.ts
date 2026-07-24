import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiJson, apiRequest } from '../../../lib/api';
import type { BackendUser, AddUserForm, UserRow } from '../../../types/admin';

const ROLE_NAMES: Record<number, string> = {
  1: 'Super Admin',
  2: 'Risk Officer',
  3: 'Data Analyst',
  4: 'Viewer',
  5: 'Auditor',
};

const ROLE_CLASSES: Record<string, string> = {
  'Super Admin': 'badge-purple',
  'Risk Officer': 'bg-violet-50 text-violet-700 badge',
  'Data Analyst': 'badge-info',
  'Viewer': 'badge-neutral',
  'Auditor': 'badge-warning',
};

function getInitials(name: string): string {
  return name.split(' ').map(part => part[0]).join('').toUpperCase();
}

function formatStatus(status: string): string {
  if (!status) return 'Active';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function mapBackendUser(backendUser: BackendUser): UserRow {
  const role = ROLE_NAMES[backendUser.roleId] || 'Viewer';
  return {
    id: backendUser.id,
    name: backendUser.name,
    initials: getInitials(backendUser.name),
    email: backendUser.email,
    role,
    roleClass: ROLE_CLASSES[role] || 'badge-neutral',
    status: formatStatus(backendUser.status),
    lastLogin: 'Never',
    dept: 'General'
  };
}

export function useUserManagement() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [addForm, setAddForm] = useState<AddUserForm>({ name: '', email: '', roleId: '4' });
  const [editForm, setEditForm] = useState<AddUserForm>({ name: '', email: '', roleId: '4' });
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = () => {
    setIsLoading(true);
    apiJson<BackendUser[]>('/users')
      .then(data => {
        setUsers(data.map(mapBackendUser));
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActivate = (id: number) => {
    apiRequest(`/users/${id}/activate`, { method: 'POST' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to activate user');
        toast.success('User activated successfully');
        fetchUsers();
      })
      .catch(() => toast.error('Failed to activate user'));
  };

  const handleDeactivate = (id: number) => {
    apiRequest(`/users/${id}/deactivate`, { method: 'POST' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to deactivate user');
        toast.success('User deactivated successfully');
        fetchUsers();
      })
      .catch(() => toast.error('Failed to deactivate user'));
  };

  const handleAddUser = () => {
    apiRequest('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addForm.name, email: addForm.email, roleId: parseInt(addForm.roleId) })
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to add user');
        toast.success('User added successfully');
        setIsAddOpen(false);
        setAddForm({ name: '', email: '', roleId: '4' });
        fetchUsers();
      })
      .catch(() => toast.error('Failed to add user'));
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    apiRequest(`/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.name, roleId: parseInt(editForm.roleId) })
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update user');
        toast.success('User updated successfully');
        setIsEditOpen(false);
        setSelectedUser(null);
        fetchUsers();
      })
      .catch(() => toast.error('Failed to update user'));
  };

  const handleDeleteUser = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    apiRequest(`/users/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete user');
        toast.success('User deleted successfully');
        fetchUsers();
      })
      .catch(() => toast.error('Failed to delete user'));
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;
    apiRequest(`/users/${selectedUser.id}/reset-password`, {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to reset password');
        toast.success('Password reset to default successfully');
        setIsEditOpen(false);
        setSelectedUser(null);
      })
      .catch(() => toast.error('Failed to reset password'));
  };

  const openEdit = (user: UserRow) => {
    setSelectedUser(user);
    const roleIdEntry = Object.entries(ROLE_NAMES).find(([_, name]) => name === user.role);
    setEditForm({
      name: user.name,
      email: user.email,
      roleId: roleIdEntry ? roleIdEntry[0] : '4'
    });
    setIsEditOpen(true);
  };

  const filtered = users.filter(user =>
    !search ||
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return {
    users,
    search,
    setSearch,
    filtered,
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    selectedUser,
    addForm,
    setAddForm,
    editForm,
    setEditForm,
    handleActivate,
    handleDeactivate,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleResetPassword,
    openEdit,
    isLoading
  };
}