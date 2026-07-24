import React, { useState, useRef } from 'react';
import { Modal } from '../../../components/ui';
import { apiRequest } from '../../../lib/api';
import toast from 'react-hot-toast';
import { IconUpload, IconAlertTriangle, IconCheck, IconTrash, IconFileSpreadsheet } from '@tabler/icons-react';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedRow {
  loanId: string;
  assetClass: string;
  borrowerName: string;
  borrowerType: string;
  sector: string;
  city: string;
  country: string;
  borrowerRegNo: string;
  loanAmount: string;
  loanTenure: string;
  loanStartDate: string;
  loanEndDate: string;
  loanStatus: string;
  outstandingAmount?: string;
  activityPeriod?: string;
  dataQuality?: string;
  financedEmissions?: string;
  errors: string[];
}

const VALID_ASSET_CLASSES = ['Business Loans', 'Commercial Real Estate', 'Motor Vehicle', 'Mortgage'];
const REQUIRED_COLUMNS = ['Loan ID', 'Asset Class', 'Borrower Name'];
const OPTIONAL_COLUMNS = [
  'Borrower Type',
  'Sector',
  'City',
  'Country',
  'Loan Amount',
  'Outstanding Amount',
  'Activity Period',
  'Data Quality'
];
const SAMPLE_CSV =
  'Loan ID,Asset Class,Borrower Name,Loan Amount,Outstanding Amount,Activity Period\n' +
  'LN-1001,Business Loans,Acme Traders,250000,175000,2026-07';

export default function ImportCsvModal({ isOpen, onClose, onSuccess }: ImportCsvModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [skipErrors, setSkipErrors] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Simple CSV parser supporting double quotes and commas
  function parseCSV(text: string): string[][] {
    const lines: string[][] = [];
    let row: string[] = [];
    let val = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];
      
      if (c === '"') {
        if (inQuotes && next === '"') {
          val += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(val.trim());
        val = '';
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') i++; // Skip LF if CRLF
        row.push(val.trim());
        lines.push(row);
        row = [];
        val = '';
      } else {
        val += c;
      }
    }
    
    if (val || row.length > 0) {
      row.push(val.trim());
      lines.push(row);
    }
    
    // Filter out completely empty lines
    return lines.filter(line => line.some(val => val !== ''));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    processFile(selectedFile);
  }

  function processFile(selectedFile: File) {
    if (!selectedFile.name.endsWith('.csv')) {
      setErrorMsg('Please select a valid CSV file');
      setFile(null);
      setRows([]);
      return;
    }

    setErrorMsg(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length < 2) {
          setErrorMsg('CSV file is empty or lacks headers');
          return;
        }

        // Header mapping
        const headers = parsed[0].map(h => h.toLowerCase().replace(/\s+|_/g, ''));
        const loanIdIdx = headers.findIndex(h => h === 'loanid' || h === 'id');
        const assetClassIdx = headers.findIndex(h => h === 'assetclass' || h === 'type' || h === 'class');
        const borrowerNameIdx = headers.findIndex(h => h === 'borrowername' || h === 'borrower' || h === 'name');
        const borrowerTypeIdx = headers.findIndex(h => h === 'borrowertype');
        const sectorIdx = headers.findIndex(h => h === 'sector');
        const cityIdx = headers.findIndex(h => h === 'city');
        const countryIdx = headers.findIndex(h => h === 'country');
        const borrowerRegIdx = headers.findIndex(h => h === 'borrowerregno' || h === 'regno');
        const loanAmountIdx = headers.findIndex(h => h === 'loanamount' || h === 'amount');
        const loanTenureIdx = headers.findIndex(h => h === 'loantenure' || h === 'tenure');
        const loanStartDateIdx = headers.findIndex(h => h === 'loanstartdate' || h === 'startdate');
        const loanEndDateIdx = headers.findIndex(h => h === 'loanenddate' || h === 'enddate');
        const loanStatusIdx = headers.findIndex(h => h === 'loanstatus' || h === 'status');
        const outstandingAmountIdx = headers.findIndex(h => h === 'outstandingamount' || h === 'outstanding');
        const activityPeriodIdx = headers.findIndex(h => h === 'activityperiod' || h === 'period');
        const dataQualityIdx = headers.findIndex(h => h === 'dataquality' || h === 'dq');
        const financedEmissionsIdx = headers.findIndex(h => h === 'financedemissions' || h === 'emissions');

        if (loanIdIdx === -1 || assetClassIdx === -1 || borrowerNameIdx === -1) {
          setErrorMsg('CSV must contain at least Loan ID, Asset Class, and Borrower Name columns');
          return;
        }

        const parsedRows: ParsedRow[] = [];
        const seenLoanIds = new Set<string>();

        for (let i = 1; i < parsed.length; i++) {
          const line = parsed[i];
          if (line.length === 0 || (line.length === 1 && line[0] === '')) continue;

          const loanId = line[loanIdIdx]?.trim() || '';
          const rawAssetClass = line[assetClassIdx]?.trim() || '';
          const borrowerName = line[borrowerNameIdx]?.trim() || '';

          // Normalize asset class casing/naming
          let assetClass = rawAssetClass;
          const matchedClass = VALID_ASSET_CLASSES.find(
            vac => vac.toLowerCase() === rawAssetClass.toLowerCase()
          );
          if (matchedClass) {
            assetClass = matchedClass;
          }

          const rowErrors: string[] = [];

          if (!loanId) {
            rowErrors.push('Missing Loan ID');
          } else if (seenLoanIds.has(loanId)) {
            rowErrors.push(`Duplicate Loan ID in CSV: ${loanId}`);
          } else {
            seenLoanIds.add(loanId);
          }

          if (!borrowerName) {
            rowErrors.push('Missing Borrower Name');
          }

          if (!rawAssetClass) {
            rowErrors.push('Missing Asset Class');
          } else if (!matchedClass) {
            rowErrors.push(`Invalid Asset Class ("${rawAssetClass}"). Must be Business Loans, Commercial Real Estate, Motor Vehicle, or Mortgage`);
          }

          const loanAmountVal = loanAmountIdx !== -1 ? line[loanAmountIdx]?.trim() : '';
          if (loanAmountVal && isNaN(Number(loanAmountVal))) {
            rowErrors.push(`Invalid Loan Amount: "${loanAmountVal}"`);
          }

          const outstandingVal = outstandingAmountIdx !== -1 ? line[outstandingAmountIdx]?.trim() : '';
          if (outstandingVal && isNaN(Number(outstandingVal))) {
            rowErrors.push(`Invalid Outstanding Amount: "${outstandingVal}"`);
          }

          const financedEmissionsVal = financedEmissionsIdx !== -1 ? line[financedEmissionsIdx]?.trim() : '';
          if (financedEmissionsVal && isNaN(Number(financedEmissionsVal))) {
            rowErrors.push(`Invalid Financed Emissions: "${financedEmissionsVal}"`);
          }

          parsedRows.push({
            loanId,
            assetClass,
            borrowerName,
            borrowerType: borrowerTypeIdx !== -1 ? line[borrowerTypeIdx]?.trim() || 'Large Corporate' : 'Large Corporate',
            sector: sectorIdx !== -1 ? line[sectorIdx]?.trim() || '-' : '-',
            city: cityIdx !== -1 ? line[cityIdx]?.trim() || '' : '',
            country: countryIdx !== -1 ? line[countryIdx]?.trim() || 'Kenya' : 'Kenya',
            borrowerRegNo: borrowerRegIdx !== -1 ? line[borrowerRegIdx]?.trim() || '' : '',
            loanAmount: loanAmountVal || '0',
            loanTenure: loanTenureIdx !== -1 ? line[loanTenureIdx]?.trim() || '0' : '0',
            loanStartDate: loanStartDateIdx !== -1 ? line[loanStartDateIdx]?.trim() || '' : '',
            loanEndDate: loanEndDateIdx !== -1 ? line[loanEndDateIdx]?.trim() || '' : '',
            loanStatus: loanStatusIdx !== -1 ? line[loanStatusIdx]?.trim() || 'Active' : 'Active',
            outstandingAmount: outstandingVal,
            activityPeriod: activityPeriodIdx !== -1 ? line[activityPeriodIdx]?.trim() : undefined,
            dataQuality: dataQualityIdx !== -1 ? line[dataQualityIdx]?.trim() : undefined,
            financedEmissions: financedEmissionsVal,
            errors: rowErrors
          });
        }

        setRows(parsedRows);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to parse CSV file content.');
      }
    };
    reader.readAsText(selectedFile);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }

  function clearFile() {
    setFile(null);
    setRows([]);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleImport() {
    const errorCount = rows.filter(r => r.errors.length > 0).length;
    
    let loansToUpload = rows;
    if (errorCount > 0) {
      if (skipErrors) {
        loansToUpload = rows.filter(r => r.errors.length === 0);
      } else {
        toast.error('Please resolve errors or check "Skip rows with errors" to proceed.');
        return;
      }
    }

    if (loansToUpload.length === 0) {
      toast.error('No valid loan records to import');
      return;
    }

    setIsUploading(true);
    try {
      const res = await apiRequest('/loan-configurations/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loans: loansToUpload })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to import portfolio');
      }

      const summary = await res.json();
      toast.success(`Imported ${summary.loansCount} loans and initialized/updated ${summary.capturesCount} data captures.`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || 'Error uploading loan portfolio');
    } finally {
      setIsUploading(false);
    }
  }

  const invalidRowsCount = rows.filter(r => r.errors.length > 0).length;

  return (
    <Modal
      title="Import Loan Portfolio (CSV)"
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary" disabled={isUploading}>Cancel</button>
          {rows.length > 0 && (
            <button
              onClick={handleImport}
              className="btn btn-primary"
              disabled={isUploading || (invalidRowsCount > 0 && !skipErrors)}
            >
              {isUploading ? 'Importing...' : `Import Portfolio (${skipErrors ? rows.length - invalidRowsCount : rows.length} row${rows.length > 1 ? 's' : ''})`}
            </button>
          )}
        </>
      }
    >
      <div style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>
        Import multiple loan records. Your CSV must have columns matching at least: <strong>Loan ID</strong>, <strong>Asset Class</strong>, and <strong>Borrower Name</strong>. Optional fields include <strong>Outstanding Amount</strong> and <strong>Activity Period</strong> to automatically seed data captures.
      </div>

      <div style={{ border: '1px solid #dbeafe', background: '#eff6ff', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1e3a8a', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
          <IconFileSpreadsheet size={17} />
          Required CSV format before import
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#1e40af', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Required columns</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {REQUIRED_COLUMNS.map(column => (
                <span key={column} style={{ background: '#ffffff', border: '1px solid #bfdbfe', borderRadius: 999, color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '3px 8px' }}>{column}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#1e40af', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Allowed Asset Class values</div>
            <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{VALID_ASSET_CLASSES.join(', ')}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#334155', marginBottom: 8 }}>
          Optional accepted columns: {OPTIONAL_COLUMNS.join(', ')}. Use plain numbers for amount fields, and keep header names exactly as shown where possible.
        </div>
        <pre style={{ margin: 0, background: '#ffffff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '9px 10px', color: '#0f172a', fontSize: 11, lineHeight: 1.5, overflowX: 'auto' }}>{SAMPLE_CSV}</pre>
      </div>

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconAlertTriangle size={16} /> {errorMsg}
        </div>
      )}

      {/* File Dropzone */}
      {!file ? (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: 8,
            padding: '30px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: '#f8fafc',
            transition: 'border-color 0.2s',
          }}
          className="hover:border-blue-400"
        >
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <IconUpload size={32} style={{ color: '#64748b', margin: '0 auto 8px' }} />
          <div style={{ fontWeight: 600, fontSize: 14, color: '#334155' }}>Drag & Drop your CSV file here</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>or click to browse from your computer</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* File details banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 6, padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconCheck size={16} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>{file.name}</span>
              <span style={{ fontSize: 11, color: '#15803d' }}>({rows.length} records found)</span>
            </div>
            <button onClick={clearFile} className="btn-icon" style={{ padding: 4 }} title="Remove file">
              <IconTrash size={15} style={{ color: '#b91c1c' }} />
            </button>
          </div>

          {/* Validation section if errors present */}
          {invalidRowsCount > 0 && (
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 6, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#92400e', fontWeight: 600 }}>
                <IconAlertTriangle size={16} />
                Found {invalidRowsCount} row{invalidRowsCount > 1 ? 's' : ''} with validation errors.
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#78350f', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={skipErrors}
                  onChange={e => setSkipErrors(e.target.checked)}
                  style={{ width: 14, height: 14 }}
                />
                Skip invalid rows and import only the valid {rows.length - invalidRowsCount} rows.
              </label>
            </div>
          )}

          {/* Table Preview */}
          <div style={{ maxHeight: 250, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 6 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>Loan ID</th>
                  <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>Asset Class</th>
                  <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>Borrower</th>
                  <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>Amount (USD)</th>
                  <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>Outstanding</th>
                  <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>Errors / Warnings</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: row.errors.length > 0 ? '#fef2f2' : 'transparent' }}>
                    <td style={{ padding: '6px 10px' }}>
                      {row.errors.length > 0 ? (
                        <span style={{ fontSize: 9, background: '#fee2e2', color: '#ef4444', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>ERROR</span>
                      ) : (
                        <span style={{ fontSize: 9, background: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>VALID</span>
                      )}
                    </td>
                    <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{row.loanId || '-'}</td>
                    <td style={{ padding: '6px 10px' }}>{row.assetClass || '-'}</td>
                    <td style={{ padding: '6px 10px', fontWeight: 500 }}>{row.borrowerName || '-'}</td>
                    <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{Number(row.loanAmount).toLocaleString()}</td>
                    <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{row.outstandingAmount ? Number(row.outstandingAmount).toLocaleString() : '-'}</td>
                    <td style={{ padding: '6px 10px', color: '#b91c1c', fontWeight: 500 }}>
                      {row.errors.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}
