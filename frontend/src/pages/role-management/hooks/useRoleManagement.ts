import { useEffect, useState, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { apiJson, apiRequest } from '../../../lib/api';
import type { CreateRoleForm, PermissionMatrix, Role } from '../../../types/admin';

const EMPTY_CREATE_ROLE_FORM: CreateRoleForm = { name: '', desc: '', color: '#3b82f6' };

export function useRoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<PermissionMatrix>({});
  const [editedRoleName, setEditedRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateRoleForm>(EMPTY_CREATE_ROLE_FORM);

  const fetchRoles = () => {
    apiJson<Role[]>('/roles')
      .then(data => {
        setRoles(data);

        if (data.length > 0 && !activeRole) {
          setActiveRole(data[0]);
          return;
        }

        if (data.length === 0) {
          setActiveRole(null);
          setPermissions({});
        }
      })
      .catch(error => {
        console.error(error);
        toast.error((error as Error).message || 'Failed to fetch roles.');
      });
  };

  const fetchPermissions = (roleId: number) => {
    apiJson<PermissionMatrix>(`/roles/${roleId}/permissions`)
      .then(data => setPermissions(data))
      .catch(error => {
        console.error(error);
        toast.error('Failed to fetch permissions');
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (activeRole) {
      setEditedRoleName(activeRole.name);
      fetchPermissions(activeRole.id);
    }
  }, [activeRole]);

  const handleCreateRole = () => {
    if (!createForm.name) {
      toast.error('Role name is required');
      return;
    }

    setIsLoading(true);
    apiJson<Role>('/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm)
    })
      .then(newRole => {
        toast.success(`Role ${newRole.name} created!`);
        fetchRoles();
        setActiveRole(newRole);
        setIsCreateOpen(false);
        setCreateForm(EMPTY_CREATE_ROLE_FORM);
      })
      .catch(error => {
        console.error(error);
        toast.error('Failed to create role');
      })
      .finally(() => setIsLoading(false));
  };

  const handleSaveChanges = () => {
    if (!activeRole) return;

    setIsLoading(true);

    const saveRoleName = editedRoleName !== activeRole.name
      ? apiRequest(`/roles/${activeRole.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...activeRole, name: editedRoleName })
        }).then(res => {
          if (!res.ok) throw new Error('Failed to update role name');
          return res;
        })
      : Promise.resolve();

    saveRoleName
      .then(() => apiRequest(`/roles/${activeRole.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissions)
      }))
      .then(response => {
        if (!response.ok) throw new Error('Failed to save changes');

        toast.success('Changes saved successfully');
        fetchRoles();
        setActiveRole({ ...activeRole, name: editedRoleName });
      })
      .catch(error => {
        console.error(error);
        toast.error('Failed to save changes');
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteRole = (roleId: number, event: MouseEvent) => {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this role?')) return;

    setIsLoading(true);
    apiRequest(`/roles/${roleId}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete role');

        toast.success('Role deleted');
        if (activeRole?.id === roleId) {
          setActiveRole(null);
          setPermissions({});
        }
        fetchRoles();
      })
      .catch(error => {
        console.error(error);
        toast.error('Failed to delete role');
      })
      .finally(() => setIsLoading(false));
  };

  const handleTogglePermission = (moduleName: string, permission: string) => {
    setPermissions(prev => {
      const currentPermissions = prev[moduleName] || [];
      const hasPermission = currentPermissions.includes(permission);

      return {
        ...prev,
        [moduleName]: hasPermission
          ? currentPermissions.filter(item => item !== permission)
          : [...currentPermissions, permission]
      };
    });
  };

  return {
    roles,
    activeRole,
    setActiveRole,
    permissions,
    editedRoleName,
    setEditedRoleName,
    isLoading,
    isCreateOpen,
    setIsCreateOpen,
    createForm,
    setCreateForm,
    handleCreateRole,
    handleSaveChanges,
    handleDeleteRole,
    handleTogglePermission,
    resetPermissions: () => activeRole && fetchPermissions(activeRole.id)
  };
}