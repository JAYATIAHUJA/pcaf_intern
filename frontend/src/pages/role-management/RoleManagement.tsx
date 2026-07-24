import { IconPlus, IconRefresh, IconDeviceFloppy } from '@tabler/icons-react';
import { useRoleManagement } from './hooks/useRoleManagement';
import { RoleList } from './components/RoleList';
import { PermissionsMatrixTable } from './components/PermissionsMatrixTable';
import { CreateRoleModal } from './components/CreateRoleModal';

export default function RoleManagement() {
  const {
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
    resetPermissions
  } = useRoleManagement();

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>Role Management</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>
            Define permission sets and assign them to users
          </p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)} 
          disabled={isLoading}
          className="btn btn-primary btn-sm"
        >
          <IconPlus size={14} /> Create Role
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
        <RoleList 
          roles={roles} 
          activeRole={activeRole} 
          setActiveRole={setActiveRole} 
          handleDeleteRole={handleDeleteRole} 
        />

        <div className="card" style={{ overflow: "hidden" }}>
          {activeRole ? (
            <>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px 20px', 
                borderBottom: '1px solid #f1f5f9' 
              }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                    Permissions for: 
                    <input 
                      type="text" 
                      value={editedRoleName} 
                      onChange={e => setEditedRoleName(e.target.value)} 
                      className="field-input"
                      style={{ padding: '4px 8px', height: 28, fontSize: 14, width: 200, fontWeight: 600, color: '#0284c7' }}
                    />
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    Check/uncheck to modify access. Changes are not saved until you click Save.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button 
                    onClick={resetPermissions} 
                    disabled={isLoading}
                    className="btn btn-secondary btn-sm"
                  >
                    <IconRefresh size={13} /> Reset
                  </button>
                  <button 
                    onClick={handleSaveChanges} 
                    disabled={isLoading}
                    className="btn btn-primary btn-sm"
                  >
                    <IconDeviceFloppy size={13} /> Save Changes
                  </button>
                </div>
              </div>

              <PermissionsMatrixTable 
                permissions={permissions} 
                handleTogglePermission={handleTogglePermission} 
              />
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
              Please select or create a role to view permissions.
            </div>
          )}
        </div>
      </div>

      {isCreateOpen && (
        <CreateRoleModal 
          onClose={() => setIsCreateOpen(false)}
          createForm={createForm}
          setCreateForm={setCreateForm}
          handleCreateRole={handleCreateRole}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
