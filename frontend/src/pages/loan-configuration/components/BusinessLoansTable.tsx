import { IconPencil, IconTrash } from '@tabler/icons-react';
import { StatusBadge } from '../../../components/ui/Badge';
import type { BusinessLoanConfig } from '../../../types';

interface BusinessLoansTableProps {
  records: BusinessLoanConfig[];
  onEdit:   (loanId: string) => void;
  onDelete: (loanId: string) => void;
}

/**
 * Renders the loan configuration table.
 * Intentionally relies on `.data-table` CSS class for all <th> styling —
 * no local `thStyle` duplication needed.
 */
export default function BusinessLoansTable({ records, onEdit, onDelete }: BusinessLoansTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Loan ID</th>
          <th>Borrower Name</th>
          <th>Type</th>
          <th>Sector</th>
          <th>Borrower Type</th>
          <th>City</th>
          <th>Country</th>
          <th>Reg No.</th>
          <th>Loan Amount</th>
          <th>Tenure</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {records.map(r => (
          <tr key={r.loanId}>
            <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#0369a1', fontWeight: 500 }}>{r.loanId}</td>
            <td style={{ fontWeight: 500, color: '#1e293b' }}>{r.borrowerName}</td>
            <td style={{ fontSize: 12, color: '#475569' }}>{r.typeOfCompany}</td>
            <td className="truncate" style={{ maxWidth: 140, fontSize: 12, color: '#475569' }}>{r.sector}</td>
            <td style={{ fontSize: 12, color: '#475569' }}>{r.borrowerType}</td>
            <td style={{ fontSize: 12, color: '#475569' }}>{r.city}</td>
            <td style={{ fontSize: 12, color: '#475569' }}>{r.country}</td>
            <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{r.borrowerRegNo}</td>
            <td style={{ fontFamily: 'monospace', fontSize: 12 }}>${(r.loanAmount || 0).toLocaleString()}</td>
            <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.loanTenure}</td>
            <td style={{ fontSize: 12, color: '#64748b' }}>{r.loanStartDate}</td>
            <td style={{ fontSize: 12, color: '#64748b' }}>{r.loanEndDate}</td>
            <td><StatusBadge status={r.loanStatus} /></td>
            <td>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(r.loanId)}
                  className="btn-icon"
                  style={{ width: 28, height: 28, color: '#0284c7' }}
                  title="Edit loan"
                >
                  <IconPencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(r.loanId)}
                  className="btn-icon"
                  style={{ width: 28, height: 28, color: '#fb7185' }}
                  title="Delete loan"
                >
                  <IconTrash size={13} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
