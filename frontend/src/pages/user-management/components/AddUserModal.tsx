import type { Dispatch, SetStateAction } from 'react';
import { Modal } from '../../../components/ui';
import { Input } from '../../../components/form';
import type { AddUserForm } from '../../../types/admin';

interface AddUserModalProps {
  onClose: () => void;
  addForm: AddUserForm;
  setAddForm: Dispatch<SetStateAction<AddUserForm>>;
  handleAddUser: () => void;
}

export function AddUserModal({ onClose, addForm, setAddForm, handleAddUser }: AddUserModalProps) {
  const setField = (field: keyof AddUserForm) => (value: string) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      title="Add New User"
      onClose={onClose}
      footer={<button onClick={handleAddUser} className="btn btn-primary">Add User</button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Full Name"
          value={addForm.name}
          onChange={setField('name')}
          placeholder="e.g. John Doe"
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={addForm.email}
          onChange={setField('email')}
          placeholder="john@example.com"
          required
        />
        <div>
          <label className="field-label">Role<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
          <select
            value={addForm.roleId}
            onChange={event => setAddForm(prev => ({ ...prev, roleId: event.target.value }))}
            className="field-select"
          >
            <option value="1">Super Admin</option>
            <option value="2">Risk Officer</option>
            <option value="3">Data Analyst</option>
            <option value="4">Viewer</option>
            <option value="5">Auditor</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}