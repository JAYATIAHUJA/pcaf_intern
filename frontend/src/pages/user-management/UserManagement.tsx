import React from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useUserManagement } from './hooks/useUserManagement';
import { StatsStrip } from './components/StatsStrip';
import { UserListTable } from './components/UserListTable';
import { AddUserModal } from './components/AddUserModal';
import { EditUserModal } from './components/EditUserModal';

export default function UserManagement() {
  const {
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
    openEdit
  } = useUserManagement();

  return (
    <div style={{ padding: 24, background: "#f1f5f9", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>User Management</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>
            Manage platform access, roles and account status
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="btn btn-primary btn-sm"
          >
            <IconPlus size={14} /> Add User
          </button>
        </div>
      </div>

      <StatsStrip users={users} />

      <UserListTable 
        filteredUsers={filtered}
        search={search}
        setSearch={setSearch}
        handleActivate={handleActivate}
        handleDeactivate={handleDeactivate}
        onEdit={openEdit}
        onDelete={handleDeleteUser}
      />

      {isAddOpen && (
        <AddUserModal 
          onClose={() => setIsAddOpen(false)}
          addForm={addForm}
          setAddForm={setAddForm}
          handleAddUser={handleAddUser}
        />
      )}

      {isEditOpen && selectedUser && (
        <EditUserModal 
          onClose={() => {
            setIsEditOpen(false);
          }}
          user={selectedUser}
          editForm={editForm}
          setEditForm={setEditForm}
          handleEditUser={handleEditUser}
          handleResetPassword={handleResetPassword}
        />
      )}
    </div>
  );
}
