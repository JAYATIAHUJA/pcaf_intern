import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IconAlertTriangle, IconCheck, IconDownload, IconFileSpreadsheet, IconTrash, IconUpload } from '@tabler/icons-react';
import { Modal } from '../../../components/ui';
import { apiRequest } from '../../../lib/api';
import { activeOptionValues, buildCsv, CSV_TEMPLATES, DEFAULT_MASTER_DATA, type MasterDataMap } from '../../../constants/masterData';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  masterData?: MasterDataMap;
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
  typeOfCompany?: string;
  propertyId?: string;
  yearBuilt?: string;
  propertyCategory?: string;
  propertyType?: string;
  totalFloors?: string;
  propertyLocation?: string;
  propertyValue?: string;
  floorAreaFinanced?: string;
  floorArea?: string;
  buildingName?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  vehicleMakeModel?: string;
  fuelType?: string;
  vehicleValue?: string;
  errors: string[];
}

const REQUIRED_COLUMNS = ['Loan ID', 'Asset Class', 'Borrower Name'];
const OPTIONAL_COLUMNS = ['Borrower Type', 'Sector', 'City', 'Country', 'Loan Amount', 'Loan Tenure', 'Loan Status', 'Outstanding Amount', 'Activity Period', 'Data Quality'];

export default function ImportCsvModal({ isOpen, onClose, onSuccess, masterData = DEFAULT_MASTER_DATA }: ImportCsvModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [skipErrors, setSkipErrors] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [templateKey, setTemplateKey] = useState(CSV_TEMPLATES[0].key);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const dropdownOptions = {
    assetClass: activeOptionValues(masterData, 'asset_class'),
    borrowerType: activeOptionValues(masterData, 'borrower_type'),
    sector: activeOptionValues(masterData, 'sector'),
    city: activeOptionValues(masterData, 'city'),
    country: activeOptionValues(masterData, 'country'),
    loanStatus: activeOptionValues(masterData, 'loan_status'),
    companyType: activeOptionValues(masterData, 'company_type'),
    propertyCategory: activeOptionValues(masterData, 'property_category'),
    propertyType: activeOptionValues(masterData, 'property_type'),
    vehicleType: activeOptionValues(masterData, 'vehicle_type'),
    fuelType: activeOptionValues(masterData, 'fuel_type'),
    dataQuality: activeOptionValues(masterData, 'data_quality')
  };

  function parseCSV(text: string): string[][] {
    const lines: string[][] = [];
    let row: string[] = [];
    let val = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];
      if (c === '"') {
        if (inQuotes && next === '"') { val += '"'; i++; } else { inQuotes = !inQuotes; }
      } else if (c === ',' && !inQuotes) {
        row.push(val.trim()); val = '';
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') i++;
        row.push(val.trim()); lines.push(row); row = []; val = '';
      } else {
        val += c;
      }
    }
    if (val || row.length > 0) { row.push(val.trim()); lines.push(row); }
    return lines.filter(line => line.some(item => item !== ''));
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
    reader.onload = event => {
      try {
        const parsed = parseCSV(event.target?.result as string);
        if (parsed.length < 2) {
          setErrorMsg('CSV file is empty or lacks headers');
          return;
        }

        const headers = parsed[0].map(normalizeHeader);
        const idx = (...names: string[]) => headers.findIndex(h => names.includes(h));
        const indexes = {
          loanId: idx('loanid', 'id'), assetClass: idx('assetclass', 'type', 'class'), borrowerName: idx('borrowername', 'borrower', 'name'),
          borrowerType: idx('borrowertype'), sector: idx('sector'), city: idx('city'), country: idx('country'), borrowerRegNo: idx('borrowerregno', 'regno'),
          loanAmount: idx('loanamount', 'amount'), loanTenure: idx('loantenure', 'tenure'), loanStartDate: idx('loanstartdate', 'startdate'), loanEndDate: idx('loanenddate', 'enddate'), loanStatus: idx('loanstatus', 'status'),
          outstandingAmount: idx('outstandingamount', 'outstanding'), activityPeriod: idx('activityperiod', 'period'), dataQuality: idx('dataquality', 'dq'), financedEmissions: idx('financedemissions', 'emissions'),
          typeOfCompany: idx('typeofcompany', 'companytype'), propertyId: idx('propertyid'), yearBuilt: idx('yearbuilt'), propertyCategory: idx('propertycategory'), propertyType: idx('propertytype'), totalFloors: idx('totalfloors'), propertyLocation: idx('propertylocation'), propertyValue: idx('propertyvalue'), floorAreaFinanced: idx('floorareafinanced'), floorArea: idx('floorarea'), buildingName: idx('buildingname'), vehicleType: idx('vehicletype'), vehicleNumber: idx('vehiclenumber'), vehicleMakeModel: idx('vehiclemakemodel', 'makemodel'), fuelType: idx('fueltype'), vehicleValue: idx('vehiclevalue')
        };

        if (indexes.loanId === -1 || indexes.assetClass === -1 || indexes.borrowerName === -1) {
          setErrorMsg('CSV must contain at least Loan ID, Asset Class, and Borrower Name columns');
          return;
        }

        const seenLoanIds = new Set<string>();
        const parsedRows = parsed.slice(1).map(line => buildRow(line, indexes, seenLoanIds));
        setRows(parsedRows);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to parse CSV file content.');
      }
    };
    reader.readAsText(selectedFile);
  }

  function buildRow(line: string[], indexes: Record<string, number>, seenLoanIds: Set<string>): ParsedRow {
    const read = (key: string) => indexes[key] !== -1 ? line[indexes[key]]?.trim() || '' : '';
    const errors: string[] = [];
    const loanId = read('loanId');
    const rawAssetClass = read('assetClass');
    const matchedClass = dropdownOptions.assetClass.find(item => item.toLowerCase() === rawAssetClass.toLowerCase());
    const assetClass = matchedClass || rawAssetClass;
    const borrowerName = read('borrowerName');
    const borrowerType = read('borrowerType') || 'Large Corporate';
    const sector = read('sector') || '-';
    const city = read('city');
    const country = read('country') || 'Kenya';
    const loanStatus = read('loanStatus') || 'Active';
    const dataQuality = read('dataQuality');
    const typeOfCompany = read('typeOfCompany');
    const propertyCategory = read('propertyCategory');
    const propertyType = read('propertyType');
    const vehicleType = read('vehicleType');
    const fuelType = read('fuelType');

    if (!loanId) errors.push('Missing Loan ID');
    else if (seenLoanIds.has(loanId)) errors.push(`Duplicate Loan ID in CSV: ${loanId}`);
    else seenLoanIds.add(loanId);
    if (!borrowerName) errors.push('Missing Borrower Name');
    if (!rawAssetClass) errors.push('Missing Asset Class');
    else if (!matchedClass) errors.push(`Invalid Asset Class ("${rawAssetClass}"). Must be one of: ${dropdownOptions.assetClass.join(', ')}`);

    validateNumber('Loan Amount', read('loanAmount'), errors);
    validateNumber('Outstanding Amount', read('outstandingAmount'), errors);
    validateNumber('Financed Emissions', read('financedEmissions'), errors);
    validateNumber('Property Value', read('propertyValue'), errors);
    validateNumber('Vehicle Value', read('vehicleValue'), errors);
    validateDropdown('Borrower Type', borrowerType, dropdownOptions.borrowerType, errors);
    if (sector !== '-') validateDropdown('Sector', sector, dropdownOptions.sector, errors);
    validateDropdown('City', city, dropdownOptions.city, errors);
    validateDropdown('Country', country, dropdownOptions.country, errors);
    validateDropdown('Loan Status', loanStatus, dropdownOptions.loanStatus, errors);
    validateDropdown('Type Of Company', typeOfCompany, dropdownOptions.companyType, errors);
    validateDropdown('Property Category', propertyCategory, dropdownOptions.propertyCategory, errors);
    validateDropdown('Property Type', propertyType, dropdownOptions.propertyType, errors);
    validateDropdown('Vehicle Type', vehicleType, dropdownOptions.vehicleType, errors);
    validateDropdown('Fuel Type', fuelType, dropdownOptions.fuelType, errors);
    validateDropdown('Data Quality', dataQuality, dropdownOptions.dataQuality, errors);

    return {
      loanId, assetClass, borrowerName, borrowerType, sector, city, country,
      borrowerRegNo: read('borrowerRegNo'), loanAmount: read('loanAmount') || '0', loanTenure: read('loanTenure') || '0', loanStartDate: read('loanStartDate'), loanEndDate: read('loanEndDate'), loanStatus,
      outstandingAmount: read('outstandingAmount'), activityPeriod: read('activityPeriod'), dataQuality: dataQuality || undefined, financedEmissions: read('financedEmissions'),
      typeOfCompany, propertyId: read('propertyId'), yearBuilt: read('yearBuilt'), propertyCategory, propertyType, totalFloors: read('totalFloors'), propertyLocation: read('propertyLocation'), propertyValue: read('propertyValue'), floorAreaFinanced: read('floorAreaFinanced'), floorArea: read('floorArea'), buildingName: read('buildingName'), vehicleType, vehicleNumber: read('vehicleNumber'), vehicleMakeModel: read('vehicleMakeModel'), fuelType, vehicleValue: read('vehicleValue'),
      errors
    };
  }

  function downloadTemplate() {
    const template = CSV_TEMPLATES.find(item => item.key === templateKey) || CSV_TEMPLATES[0];
    const blob = new Blob([buildCsv(template.key)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pcaf_${template.key}_template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearFile() {
    setFile(null); setRows([]); setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleImport() {
    const invalidRowsCount = rows.filter(r => r.errors.length > 0).length;
    const loansToUpload = invalidRowsCount > 0 && skipErrors ? rows.filter(r => r.errors.length === 0) : rows;
    if (invalidRowsCount > 0 && !skipErrors) { toast.error('Please resolve errors or skip rows with errors.'); return; }
    if (loansToUpload.length === 0) { toast.error('No valid loan records to import'); return; }

    setIsUploading(true);
    try {
      const res = await apiRequest('/loan-configurations/import', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ loans: loansToUpload })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to import portfolio');
      const summary = await res.json();
      toast.success(`Imported ${summary.loansCount} loans and initialized/updated ${summary.capturesCount} data captures.`);
      onSuccess(); onClose();
    } catch (err) {
      toast.error((err as Error).message || 'Error uploading loan portfolio');
    } finally {
      setIsUploading(false);
    }
  }

  const invalidRowsCount = rows.filter(r => r.errors.length > 0).length;
  const sampleCsv = buildCsv(templateKey);

  return (
    <Modal title="Import Loan Portfolio (CSV)" onClose={onClose} size="xl" footer={<><button onClick={onClose} className="btn btn-secondary" disabled={isUploading}>Cancel</button>{rows.length > 0 && <button onClick={handleImport} className="btn btn-primary" disabled={isUploading || (invalidRowsCount > 0 && !skipErrors)}>{isUploading ? 'Importing...' : `Import Portfolio (${skipErrors ? rows.length - invalidRowsCount : rows.length} row${rows.length > 1 ? 's' : ''})`}</button>}</>}>
      <div style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>
        Import multiple loan records. CSV must include <strong>Loan ID</strong>, <strong>Asset Class</strong>, and <strong>Borrower Name</strong>. Dropdown fields are validated against active master data.
      </div>

      <div style={{ border: '1px solid #dbeafe', background: '#eff6ff', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1e3a8a', fontWeight: 700, fontSize: 13, marginBottom: 10 }}><IconFileSpreadsheet size={17} /> CSV templates</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginBottom: 10 }}>
          <select className="field-select" value={templateKey} onChange={e => setTemplateKey(e.target.value)}>{CSV_TEMPLATES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}</select>
          <button className="btn btn-secondary btn-sm" onClick={downloadTemplate} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IconDownload size={14} /> Download</button>
        </div>
        <div style={{ fontSize: 12, color: '#334155', marginBottom: 8 }}>Required columns: {REQUIRED_COLUMNS.join(', ')}. Optional accepted columns include {OPTIONAL_COLUMNS.join(', ')}.</div>
        <div style={{ fontSize: 12, color: '#334155', marginBottom: 8 }}>Allowed Asset Class values: {dropdownOptions.assetClass.join(', ')}</div>
        <pre style={{ margin: 0, background: '#ffffff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '9px 10px', color: '#0f172a', fontSize: 11, lineHeight: 1.5, overflowX: 'auto' }}>{sampleCsv}</pre>
      </div>

      {errorMsg && <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><IconAlertTriangle size={16} /> {errorMsg}</div>}

      {!file ? (
        <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const dropped = e.dataTransfer.files?.[0]; if (dropped) processFile(dropped); }} onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed #cbd5e1', borderRadius: 8, padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
          <input type="file" accept=".csv" ref={fileInputRef} onChange={e => { const selected = e.target.files?.[0]; if (selected) processFile(selected); }} style={{ display: 'none' }} />
          <IconUpload size={32} style={{ color: '#64748b', margin: '0 auto 8px' }} />
          <div style={{ fontWeight: 600, fontSize: 14, color: '#334155' }}>Drag & Drop your CSV file here</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>or click to browse from your computer</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 6, padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconCheck size={16} style={{ color: '#16a34a' }} /><span style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>{file.name}</span><span style={{ fontSize: 11, color: '#15803d' }}>({rows.length} records found)</span></div>
            <button onClick={clearFile} className="btn-icon" style={{ padding: 4 }} title="Remove file"><IconTrash size={15} style={{ color: '#b91c1c' }} /></button>
          </div>

          {invalidRowsCount > 0 && <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 6, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#92400e', fontWeight: 600 }}><IconAlertTriangle size={16} />Found {invalidRowsCount} row{invalidRowsCount > 1 ? 's' : ''} with validation errors.</div><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#78350f', cursor: 'pointer' }}><input type="checkbox" checked={skipErrors} onChange={e => setSkipErrors(e.target.checked)} style={{ width: 14, height: 14 }} />Skip invalid rows and import only the valid {rows.length - invalidRowsCount} rows.</label></div>}

          <div style={{ maxHeight: 250, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 6 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, borderBottom: '1px solid #e2e8f0' }}><tr>{['Status', 'Loan ID', 'Asset Class', 'Borrower', 'Amount', 'Outstanding', 'Errors / Warnings'].map(h => <th key={h} style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>{rows.map((row, i) => <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: row.errors.length > 0 ? '#fef2f2' : 'transparent' }}><td style={{ padding: '6px 10px' }}>{row.errors.length > 0 ? <span style={statusError}>ERROR</span> : <span style={statusValid}>VALID</span>}</td><td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{row.loanId || '-'}</td><td style={{ padding: '6px 10px' }}>{row.assetClass || '-'}</td><td style={{ padding: '6px 10px', fontWeight: 500 }}>{row.borrowerName || '-'}</td><td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{Number(row.loanAmount || 0).toLocaleString()}</td><td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{row.outstandingAmount ? Number(row.outstandingAmount).toLocaleString() : '-'}</td><td style={{ padding: '6px 10px', color: '#b91c1c', fontWeight: 500 }}>{row.errors.join(', ')}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}

function normalizeHeader(value: string) { return value.toLowerCase().replace(/\s+|_/g, ''); }
function validateNumber(field: string, value: string, errors: string[]) { if (value && isNaN(Number(value))) errors.push(`Invalid ${field}: "${value}"`); }
function validateDropdown(field: string, value: string, options: string[], errors: string[]) { if (value && options.length > 0 && !options.some(option => option.toLowerCase() === value.toLowerCase())) errors.push(`Invalid ${field}: "${value}"`); }

const statusError = { fontSize: 9, background: '#fee2e2', color: '#ef4444', padding: '1px 5px', borderRadius: 4, fontWeight: 700 };
const statusValid = { fontSize: 9, background: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: 4, fontWeight: 700 };
