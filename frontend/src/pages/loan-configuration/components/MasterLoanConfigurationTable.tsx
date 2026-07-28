import React from 'react';
import { IconTrash } from '@tabler/icons-react';

interface MasterLoanConfigurationTableProps {
  records: any[];
  onDelete: (loanId: string) => void;
  canManage?: boolean;
}

export default function MasterLoanConfigurationTable({ records, onDelete, canManage = true }: MasterLoanConfigurationTableProps) {
  const headers = canManage
    ? ['Loan ID', 'Asset Class', 'Borrower', 'Borrower Type', 'Sector', 'City', 'Country', 'Reg No', 'Loan Amount', 'Tenure', 'Start', 'End', 'Status', 'Asset Details', 'Actions']
    : ['Loan ID', 'Asset Class', 'Borrower', 'Borrower Type', 'Sector', 'City', 'Country', 'Tenure', 'Start', 'End', 'Status'];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: canManage ? 1500 : 1050 }}>
      <thead>
        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          {headers.map(h => <th key={h} style={thStyle}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {records.length > 0 ? records.map(r => (
          <tr key={r.loanId} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#0369a1', fontWeight: 600 }}>{r.loanId}</td>
            <td style={tdStyle}><span style={badgeStyle}>{r.assetClass}</span></td>
            <td style={{ ...tdStyle, fontWeight: 600 }}>{r.borrowerName}</td>
            <td style={tdStyle}>{r.borrowerType || '-'}</td>
            <td style={tdStyle}>{r.sector || '-'}</td>
            <td style={tdStyle}>{r.city || '-'}</td>
            <td style={tdStyle}>{r.country || '-'}</td>
            {canManage && <td style={tdStyle}>{r.borrowerRegNo || '-'}</td>}
            {canManage && <td style={{ ...tdStyle, fontFamily: 'monospace' }}>${Number(r.loanAmount || 0).toLocaleString()}</td>}
            <td style={tdStyle}>{r.loanTenure || '-'}</td>
            <td style={tdStyle}>{r.loanStartDate || '-'}</td>
            <td style={tdStyle}>{r.loanEndDate || '-'}</td>
            <td style={tdStyle}>{r.loanStatus || '-'}</td>
            {canManage && <td style={{ ...tdStyle, maxWidth: 360 }}>{assetDetails(r)}</td>}
            {canManage && (
              <td style={tdStyle}>
                <button onClick={() => onDelete(r.loanId)} className="btn-icon" style={{ width: 28, height: 28, color: '#fb7185' }} title="Delete"><IconTrash size={13} /></button>
              </td>
            )}
          </tr>
        )) : (
          <tr><td colSpan={canManage ? 15 : 11} style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>No loan configurations found.</td></tr>
        )}
      </tbody>
    </table>
  );
}

function assetDetails(r: any) {
  if (r.assetClass === 'Business Loans') return compact(['Company', r.typeOfCompany]);
  if (r.assetClass === 'Commercial Real Estate') return compact(['Property', r.propertyId], ['Type', r.propertyType], ['Value', money(r.propertyValue)], ['Area', r.floorAreaFinanced]);
  if (r.assetClass === 'Motor Vehicle') return compact(['Vehicle', r.vehicleType], ['No', r.vehicleNumber], ['Model', r.vehicleMakeModel], ['Fuel', r.fuelType], ['Value', money(r.vehicleValue)]);
  if (r.assetClass === 'Mortgage') return compact(['Building', r.buildingName], ['Type', r.propertyType], ['Value', money(r.propertyValue)], ['Area', r.floorArea]);
  return '-';
}

function compact(...parts: Array<[string, any]>) {
  const text = parts.filter(([, value]) => value !== undefined && value !== null && value !== '').map(([label, value]) => `${label}: ${value}`).join(' | ');
  return text || '-';
}

function money(value: any) {
  return value ? `$${Number(value).toLocaleString()}` : '';
}

const thStyle: React.CSSProperties = { padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#475569', textAlign: 'left', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '10px 12px', fontSize: 12, color: '#334155', verticalAlign: 'top' };
const badgeStyle: React.CSSProperties = { background: '#eff6ff', color: '#2563eb', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' };
