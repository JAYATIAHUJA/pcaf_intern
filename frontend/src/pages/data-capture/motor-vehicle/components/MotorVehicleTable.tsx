import React, { Dispatch, SetStateAction } from 'react';
import { IconCalendar, IconX, IconCheck, IconPencil, IconHistory } from '@tabler/icons-react';
import type { MotorVehicleCapture } from '../../../../types';
import { StatusBadge } from '../../../../components/ui/Badge';
import type { TabKey } from '../hooks/useMotorVehicleCapture';

interface MotorVehicleTableProps {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  shown: MotorVehicleCapture[];
  counts: Record<TabKey, number>;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  search: string;
  setSearch: (s: string) => void;
  dateFrom: string;
  setDateFrom: (d: string) => void;
  dateTo: string;
  setDateTo: (d: string) => void;
  allSelected: boolean;
  toggleAll: () => void;
  openEdit: (r: MotorVehicleCapture) => void;
  setAuditLoanId: (s: string | null) => void;
  handleApprove: () => void;
  handleReject: () => void;
}

export function MotorVehicleTable({
  tab, setTab, shown, counts, selected, setSelected,
  search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo,
  allSelected, toggleAll, openEdit, setAuditLoanId, handleApprove, handleReject
}: MotorVehicleTableProps) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 16, borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex" }}>
          {(['Pending', 'Draft', 'Rejected', 'Approved'] as TabKey[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelected([]); }}
              className={tab === t ? 'tab-btn-active' : 'tab-btn'}
            >
              {t}
              <span className="tab-count">{counts[t]}</span>
            </button>
          ))}
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
          {tab === 'Approved' && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px" }}>
              <IconCalendar size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <input 
                type="date" 
                value={dateFrom} 
                onChange={e => setDateFrom(e.target.value)} 
                style={{ fontSize: 12, color: "#475569", background: "transparent", border: "none", outline: "none", width: 112 }} 
              />
              <span style={{ color: "#cbd5e1", fontSize: 12 }}>-</span>
              <input 
                type="date" 
                value={dateTo} 
                onChange={e => setDateTo(e.target.value)} 
                style={{ fontSize: 12, color: "#475569", background: "transparent", border: "none", outline: "none", width: 112 }} 
              />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}>
                  <IconX size={12} />
                </button>
              )}
            </div>
          )}

          {tab === 'Pending' && (
            <>
              <button 
                onClick={handleApprove} 
                disabled={!selected.length} 
                className={`btn btn-success btn-sm${!selected.length ? ' opacity-40 cursor-not-allowed' : ''}`}
              >
                <IconCheck size={14} /> Approve
              </button>
              <button 
                onClick={handleReject} 
                disabled={!selected.length} 
                className={`btn btn-danger btn-sm${!selected.length ? ' opacity-40 cursor-not-allowed' : ''}`}
              >
                <IconX size={14} /> Reject
              </button>
              <div className="divider-v" />
            </>
          )}

          <input 
            placeholder="Search..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="field-input" 
            style={{ padding: "6px 12px", fontSize: 12, width: 160 }} 
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-10">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={toggleAll} 
                  className="checkbox-accent" 
                />
              </th>
              {['Activity Period', 'Loan ID', 'Borrower Type', 'Vehicle Type', 'Make & Model', 'Year', 'Outstanding', 'DQ', 'Financed E.', 'Status', 'Actions'].map(h => (
                <th key={h} className={h === 'Actions' ? 'text-center' : ''}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(r => (
              <tr key={r.id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selected.includes(String(r.id))} 
                    onChange={e => setSelected(prev => e.target.checked ? [...prev, String(r.id)] : prev.filter(i => i !== String(r.id)))} 
                    className="checkbox-accent" 
                  />
                </td>
                <td style={{ fontSize: 12, color: "#64748b" }}>{r.activityPeriod}</td>
                <td><span style={{ fontWeight: 500, color: "#1e293b" }}>{r.loanId}</span></td>
                <td style={{ fontSize: 12 }}>{r.borrowerType}</td>
                <td style={{ fontSize: 12 }}>{r.vehicleType}</td>
                <td style={{ fontSize: 12 }}>{r.vehicleMakeModel}</td>
                <td style={{ fontSize: 12 }}>{r.yearOfManufacture}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.outstandingAmount.toLocaleString()}</td>
                <td>
                  {r.dataQuality ? (
                    <span className="badge badge-info">{r.dataQuality}</span>
                  ) : (
                    <span style={{ color: "#cbd5e1", fontSize: 12 }}>-</span>
                  )}
                </td>
                <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{r.financedEmissions.toFixed(2)}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <button onClick={() => openEdit(r)} className="btn-icon" style={{ width: 28, height: 28 }}>
                      <IconPencil size={13} />
                    </button>
                    <button onClick={() => setAuditLoanId(r.loanId)} className="btn-icon" style={{ width: 28, height: 28 }}>
                      <IconHistory size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={12} style={{ textAlign: "center", padding: "40px 12px", color: "#94a3b8", fontSize: 14 }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td 
                colSpan={9} 
                style={{ 
                  textAlign: "right", 
                  fontSize: 12, 
                  fontWeight: 600, 
                  color: "#64748b", 
                  padding: "10px 12px", 
                  background: "#f8fafc", 
                  borderTop: "2px solid #e2e8f0" 
                }}
              >
                Sum:
              </td>
              <td className="font-mono font-bold px-3 py-2.5 bg-slate-50 border-t-2 border-slate-200">
                {shown.reduce((s, r) => s + r.financedEmissions, 0).toFixed(1)}
              </td>
              <td colSpan={2} style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
