import { IconTrash } from '@tabler/icons-react';
import { StatusBadge } from '../../../components/ui/Badge';

interface CommercialRETableProps {
  records: any[];
  onDelete: (loanId: string) => void;
}

export default function CommercialRETable({ records, onDelete }: CommercialRETableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={thStyle}>Loan ID</th>
          <th style={thStyle}>Borrower Name</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Sector</th>
          <th style={thStyle}>Prop. ID</th>
          <th style={thStyle}>Year Built</th>
          <th style={thStyle}>Category</th>
          <th style={thStyle}>Prop. Type</th>
          <th style={thStyle}>Floors</th>
          <th style={thStyle}>Location</th>
          <th style={thStyle}>Country</th>
          <th style={thStyle}>Prop. Value</th>
          <th style={thStyle}>Floor Area</th>
          <th style={thStyle}>Loan Amount</th>
          <th style={thStyle}>Tenure</th>
          <th style={thStyle}>Start</th>
          <th style={thStyle}>End</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}></th>
        </tr>
      </thead>
      <tbody>
        {records.map(r => (
          <tr key={r.loanId} style={{ transition: "background 0.12s" }} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#f8fafc"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=""}>
            <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, fontFamily: "monospace", color: "#0369a1" }}>{r.loanId}</td>
            <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{r.borrowerName}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.borrowerType}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.sector}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.propertyId}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.yearBuilt}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.propertyCategory}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.propertyType}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.totalFloors}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.propertyLocation}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.country}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${(r.propertyValue || 0).toLocaleString()}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.floorAreaFinanced}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${(r.loanAmount || 0).toLocaleString()}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.loanTenure}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanStartDate}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanEndDate}</td>
            <td style={{ padding: "10px 12px" }}><StatusBadge status={r.loanStatus} /></td>
            <td style={{ padding: "10px 12px" }}>
              <div className="flex gap-1">
                <button onClick={() => onDelete(r.loanId)} className="btn-icon" style={{ width: 28, height: 28, color: "#fb7185" }}><IconTrash size={13} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
  userSelect: "none"
};
