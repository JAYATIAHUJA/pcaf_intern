import React from 'react';
import { MODULES, ALL_PERMS } from '../../../../../common/constants';

interface PermissionsMatrixTableProps {
  permissions: Record<string, string[]>;
  handleTogglePermission: (moduleName: string, permAction: string) => void;
}

const PERM_COLORS: Record<string, string> = {
  view: 'badge-info', create: 'badge-success', edit: 'badge-warning',
  delete: 'bg-rose-50 text-rose-600 badge', approve: 'badge-purple', export: 'badge-neutral',
};

export function PermissionsMatrixTable({ permissions, handleTogglePermission }: PermissionsMatrixTableProps) {
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <th style={{ minWidth: 150, padding: 12, textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#475569' }}>Module</th>
              {ALL_PERMS.map((p: string) => (
                <th key={p} style={{ textAlign: 'center', padding: 12, textTransform: 'capitalize', fontWeight: 600, fontSize: 13, color: '#475569' }}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((mod: string) => {
              const perms = permissions[mod] ?? [];
              return (
                <tr key={mod} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ fontWeight: 500, color: '#334155', padding: '12px 16px', fontSize: 14 }}>{mod}</td>
                  {ALL_PERMS.map((p: string) => (
                    <td key={p} style={{ textAlign: 'center', padding: '12px 16px' }}>
                      <input 
                        type="checkbox" 
                        checked={perms.includes(p)} 
                        onChange={() => handleTogglePermission(mod, p)}
                        className="checkbox-accent" 
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '12px 20px', background: '#f8fafc' }}>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginRight: 4 }}>Permission types:</span>
        {ALL_PERMS.map((p: string) => (
          <span key={p} className={`badge ${PERM_COLORS[p]}`} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12 }}>{p}</span>
        ))}
      </div>
    </>
  );
}
