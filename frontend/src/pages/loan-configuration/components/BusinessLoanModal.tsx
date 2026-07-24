import { Input, Select, Textarea, FormRow, FormSection } from '../../../components/form';
import { Modal } from '../../../components/ui';

interface BusinessLoanModalProps {
  isOpen: boolean;
  editId: string | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onSubmit: () => void;
  sectors: string[];
}

export default function BusinessLoanModal({
  isOpen,
  editId,
  formData,
  setFormData,
  onClose,
  onSubmit,
  sectors
}: BusinessLoanModalProps) {
  if (!isOpen) return null;

  const setF = (k: string) => (v: string) => setFormData((p: any) => ({ ...p, [k]: v }));

  return (
    <Modal
      title={editId ? `Edit Loan - ${formData.loanId}` : 'Add New Business Loan'}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={onSubmit} className="btn btn-primary">{editId ? 'Save Changes' : 'Submit'}</button>
        </>
      }
    >
      <FormSection title="Loan Identification" />
      <FormRow cols={3}>
        <Input label="Loan ID" value={formData.loanId} onChange={setF('loanId')} required />
        <Select label="Type of Company" value={formData.typeOfCompany} onChange={setF('typeOfCompany')} options={['Private', 'Listed', 'Cooperative']} required />
        <Select label="Sector" value={formData.sector} onChange={setF('sector')} options={sectors} />
      </FormRow>
      <FormRow cols={3}>
        <Input label="Borrower Name" value={formData.borrowerName} onChange={setF('borrowerName')} required />
        <Select label="Borrower Type" value={formData.borrowerType} onChange={setF('borrowerType')} options={['Large Corporate', 'SME', 'MSME', 'Individual', 'Cooperative']} required />
        <Input label="Borrower Registration No." value={formData.borrowerRegNo} onChange={setF('borrowerRegNo')} />
      </FormRow>
      <FormRow cols={2}>
        <Input label="City" value={formData.city} onChange={setF('city')} />
        <Input label="Country" value={formData.country} onChange={setF('country')} />
      </FormRow>
      <FormSection title="Loan Terms" />
      <FormRow cols={4}>
        <Input label="Loan Amount (USD)" value={formData.loanAmount} onChange={setF('loanAmount')} />
        <Input label="Loan Tenure (Months)" value={formData.loanTenure} onChange={setF('loanTenure')} />
        <Input label="Loan Start Date" value={formData.loanStartDate} onChange={setF('loanStartDate')} type="date" />
        <Input label="Loan End Date" value={formData.loanEndDate} onChange={setF('loanEndDate')} type="date" />
      </FormRow>
      <Textarea label="Remarks" value={formData.remarks} onChange={setF('remarks')} rows={3} />
    </Modal>
  );
}
