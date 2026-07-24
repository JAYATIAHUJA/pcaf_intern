import { IconTrash } from '@tabler/icons-react';

interface MotorVehicleTableProps {
  records: any[];
  onDelete: (loanId: string) => void;
}

export default function MotorVehicleTable({ records, onDelete }: MotorVehicleTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={thStyle}>Loan ID</th>
          <th style={thStyle}>Borrower Name</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Sector</th>
          <th style={thStyle}>Vehicle Type</th>
          <th style={thStyle}>Veh. Number</th>
          <th style={thStyle}>Make & Model</th>
          <th style={thStyle}>Fuel Type</th>
          <th style={thStyle}>Veh. Value</th>
          <th style={thStyle}>Loan Amount</th>
          <th style={thStyle}>Start Date</th>
          <th style={thStyle}>End Date</th>
          <th style={thStyle}></th>
        </tr>
      </thead>
      <tbody>
        {records.map(r => (
          <tr key={r.loanId} style={{ transition: "background 0.12s" }} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#f8fafc"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=""}>
            <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, fontFamily: "monospace", color: "#0369a1" }}>{r.loanId}</td>
            <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{r.borrowerName}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.borrowerType}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.sector || '-'}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.vehicleType}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>{r.vehicleNumber}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.vehicleMakeModel}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.fuelType}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${(r.vehicleValue || 0).toLocaleString()}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace" }}>${(r.loanAmount || 0).toLocaleString()}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanStartDate}</td>
            <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b" }}>{r.loanEndDate}</td>
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
