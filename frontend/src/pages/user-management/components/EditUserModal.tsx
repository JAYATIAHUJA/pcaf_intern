import type { Dispatch, SetStateAction } from 'react';
import { Modal } from '../../../components/ui';
import { Input } from '../../../components/form';
import type { AddUserForm, UserRow } from '../../../types/admin';

interface EditUserModalProps {
  onClose: () => void;
  user: UserRow;
  editForm: AddUserForm;
  setEditForm: Dispatch<SetStateAction<AddUserForm>>;
  handleEditUser: () => void;
  handleResetPassword: () => void;
}

export function EditUserModal({
  onClose,
  user,
  editForm,
  setEditForm,
  handleEditUser,
  handleResetPassword
}: EditUserModalProps) {
  const setField = (field: keyof AddUserForm) => (value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const onReset = () => {
    if (window.confirm(`Are you sure you want to reset password for user "${user.name}" to default?`)) {
      handleResetPassword();
    }
  };

  return (
    <Modal
      title={`Edit User: ${user.name}`}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <button onClick={onReset} className="btn btn-warning" style={{ color: '#fff' }}>Reset Password</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button onClick={handleEditUser} className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Full Name"
          value={editForm.name}
          onChange={setField('name')}
          placeholder="e.g. John Doe"
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={editForm.email}
          onChange={setField('email')}
          placeholder="john@example.com"
          required
          readOnly
        />
        <div>
          <label className="field-label">Role<span style={{ color: '#f43f5e', marginLeft: 2 }}>*</span></label>
          <select
            value={editForm.roleId}
            onChange={event => setEditForm(prev => ({ ...prev, roleId: event.target.value }))}
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
