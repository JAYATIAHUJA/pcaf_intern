import type { Dispatch, SetStateAction } from 'react';
import { IconPencil, IconHistory, IconCheck, IconX, IconCalendar } from '@tabler/icons-react';
import { StatusBadge } from '../../../../components/ui/Badge';
import type { BusinessLoanCapture } from '../../../../types';
import type { TabKey } from '../hooks/useBusinessLoanCapture';

interface BusinessLoanTableProps {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  shown: BusinessLoanCapture[];
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
  openEdit: (record: BusinessLoanCapture) => void;
  setAuditLoanId: (id: string | null) => void;
  handleApprove: () => void;
  handleReject: () => void;
}

export function BusinessLoanTable({
  tab, setTab, shown, counts,
  selected, setSelected, search, setSearch,
  dateFrom, setDateFrom, dateTo, setDateTo,
  allSelected, toggleAll, openEdit, setAuditLoanId,
  handleApprove, handleReject
}: BusinessLoanTableProps) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 16, borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex" }}>
          {(['Pending', 'Draft', 'Rejected', 'Approved'] as TabKey[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setSelected([]); }} className={tab === t ? 'tab-btn-active' : 'tab-btn'}>
              {t}
              <span className="tab-count">{counts[t]}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
          {tab === 'Approved' && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px" }}>
              <IconCalendar size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ fontSize: 12, color: "#475569", background: "transparent", border: "none", outline: "none", width: 112 }} title="From date" />
              <span style={{ color: "#cbd5e1", fontSize: 12 }}>-</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ fontSize: 12, color: "#475569", background: "transparent", border: "none", outline: "none", width: 112 }} title="To date" />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer", marginLeft: 2 }}><IconX size={12} /></button>
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
              <button onClick={handleReject} className="btn btn-danger btn-sm">
                <IconX size={14} /> Reject
              </button>
              <div className="divider-v" />
            </>
          )}

          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="field-input" style={{ padding: "6px 12px", fontSize: 12, width: 160 }}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="checkbox-accent" />
              </th>
              {['Activity Period', 'Loan ID', 'Borrower Name', 'Type', 'Sector', 'City', 'Loan Amount', 'Total Equity', 'Total Debt', 'DQ', 'Financed E.', 'Status', 'Actions'].map(h => (
                <th key={h} className={h === 'Actions' ? 'text-center' : ''}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(r => (
              <tr key={r.id}>
                <td className="text-center">
                  <input type="checkbox" checked={selected.includes(String(r.id))} onChange={e => setSelected(prev => e.target.checked ? [...prev, String(r.id)] : prev.filter(i => i !== String(r.id)))} className="checkbox-accent" />
                </td>
                <td style={{ fontSize: 12, color: "#64748b" }}>{r.activityPeriod}</td>
                <td><span style={{ fontWeight: 500, color: "#1e293b" }}>{r.loanId}</span></td>
                <td style={{ fontSize: 14 }}>{r.borrowerName}</td>
                <td><span style={{ fontSize: 12, color: "#475569" }}>{r.typeOfCompany}</span></td>
                <td><span style={{ fontSize: 12, color: "#64748b" }}>{r.sector.length > 22 ? r.sector.substring(0, 22) + '...' : r.sector}</span></td>
                <td style={{ fontSize: 12, color: "#64748b" }}>{r.city}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.loanAmount.toLocaleString()}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.totalEquity !== undefined && r.totalEquity !== null ? Number(r.totalEquity).toLocaleString() : '0'}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.totalDebt !== undefined && r.totalDebt !== null ? Number(r.totalDebt).toLocaleString() : '0'}</td>
                <td>{r.dataQuality ? <span className="badge badge-info">{r.dataQuality}</span> : <span style={{ color: "#cbd5e1", fontSize: 12 }}>-</span>}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#334155" }}>{r.financedEmissions > 0 ? r.financedEmissions.toFixed(0) : '0'}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <button onClick={() => openEdit(r)} className="btn-icon" style={{ width: 28, height: 28 }} title="Edit"><IconPencil size={13} /></button>
                    <button onClick={() => setAuditLoanId(r.loanId)} className="btn-icon" style={{ width: 28, height: 28 }} title="Audit history"><IconHistory size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={14} style={{ textAlign: "center", padding: "40px 12px", color: "#94a3b8", fontSize: 14 }}>No records found</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={11} style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: "#64748b", padding: "10px 12px", background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>
                Sum of Financed Emissions:
              </td>
              <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#334155", padding: "10px 12px", background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>
                {shown.reduce((s, r) => s + r.financedEmissions, 0).toFixed(0)}
              </td>
              <td colSpan={2} style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
