import { IconTrash } from '@tabler/icons-react';
import type { MouseEvent } from 'react';
import type { Role } from '../../../types/admin';

interface RoleListProps {
  roles: Role[];
  activeRole: Role | null;
  setActiveRole: (role: Role) => void;
  handleDeleteRole: (roleId: number, event: MouseEvent) => void;
}

export function RoleList({ roles, activeRole, setActiveRole, handleDeleteRole }: RoleListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {roles.length === 0 && <p style={{ fontSize: 14, color: "#64748b" }}>No roles found.</p>}
      {roles.map(role => {
        const isActive = activeRole?.id === role.id;
        return (
          <div
            key={role.id}
            onClick={() => setActiveRole(role)}
            style={{
              textAlign: 'left',
              width: '100%',
              borderRadius: 12,
              padding: '14px 16px',
              border: isActive ? '1px solid #334155' : '1px solid #e2e8f0',
              background: isActive ? '#0f172a' : '#ffffff',
              cursor: 'pointer',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: role.color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? '#f1f5f9' : '#1e293b' }}>{role.name}</span>
              </div>
              <button
                onClick={(event) => handleDeleteRole(role.id, event)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                title="Delete role"
              >
                <IconTrash size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 12, color: isActive ? '#64748b' : '#94a3b8', lineHeight: 1.5, margin: 0 }}>{role.desc}</p>
              <span style={{ fontSize: 12, color: isActive ? '#64748b' : '#94a3b8' }}>{role.users} users</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}