import { IconPencil, IconUserOff, IconUserCheck, IconSearch, IconTrash } from '@tabler/icons-react';
import { StatusBadge } from '../../../components/ui/Badge';
import type { UserRow } from '../../../types/admin';

interface UserListTableProps {
  filteredUsers: UserRow[];
  search: string;
  setSearch: (search: string) => void;
  handleActivate: (id: number) => void;
  handleDeactivate: (id: number) => void;
  onEdit: (user: UserRow) => void;
  onDelete: (id: number) => void;
}

const AVATAR_COLORS = ['bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-400', 'bg-teal-500', 'bg-indigo-500'];

export function UserListTable({
  filteredUsers,
  search,
  setSearch,
  handleActivate,
  handleDeactivate,
  onEdit,
  onDelete
}: UserListTableProps) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>All Users</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <IconSearch size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              placeholder="Search users..."
              value={search}
              onChange={event => setSearch(event.target.value)}
              className="field-input !py-1.5 !text-xs pl-7 w-44"
            />
          </div>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              {['User', 'Email', 'Department', 'Role', 'Status', 'Last Login', 'Actions'].map(heading => (
                <th key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-xs">{user.initials}</span>
                    </div>
                    <span style={{ fontWeight: 500, color: "#1e293b", fontSize: 14 }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: "#64748b" }}>{user.email}</td>
                <td style={{ fontSize: 12, color: "#475569" }}>{user.dept}</td>
                <td><span className={user.roleClass}>{user.role}</span></td>
                <td><StatusBadge status={user.status} /></td>
                <td style={{ fontSize: 12, color: "#94a3b8" }}>{user.lastLogin}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(user)} className="btn-icon" style={{ width: 28, height: 28, color: "#0284c7" }} title="Edit"><IconPencil size={13} /></button>
                    {user.status === 'Active'
                      ? <button onClick={() => handleDeactivate(user.id)} className="btn-icon" style={{ width: 28, height: 28, color: "#fb7185" }} title="Deactivate"><IconUserOff size={13} /></button>
                      : <button onClick={() => handleActivate(user.id)} className="btn-icon" style={{ width: 28, height: 28, color: "#10b981" }} title="Activate"><IconUserCheck size={13} /></button>
                    }
                    <button onClick={() => onDelete(user.id)} className="btn-icon" style={{ width: 28, height: 28, color: "#f43f5e" }} title="Delete"><IconTrash size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}