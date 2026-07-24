import type { Dispatch, SetStateAction } from 'react';
import { Modal } from '../../../components/ui';
import { Input, Textarea } from '../../../components/form';
import type { CreateRoleForm } from '../../../types/admin';

interface CreateRoleModalProps {
  onClose: () => void;
  createForm: CreateRoleForm;
  setCreateForm: Dispatch<SetStateAction<CreateRoleForm>>;
  handleCreateRole: () => void;
  isLoading: boolean;
}

export function CreateRoleModal({ onClose, createForm, setCreateForm, handleCreateRole, isLoading }: CreateRoleModalProps) {
  return (
    <Modal
      title="Create New Role"
      onClose={onClose}
      footer={<button onClick={handleCreateRole} className="btn btn-primary" disabled={isLoading}>Create Role</button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Role Name"
          value={createForm.name}
          onChange={value => setCreateForm(prev => ({ ...prev, name: value }))}
          placeholder="e.g. Finance Manager"
          required
        />
        <Textarea
          label="Description"
          value={createForm.desc}
          onChange={value => setCreateForm(prev => ({ ...prev, desc: value }))}
          rows={2}
        />
        <div>
          <label className="field-label">Role Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <input
              type="color"
              value={createForm.color}
              onChange={event => setCreateForm(prev => ({ ...prev, color: event.target.value }))}
              style={{ width: 40, height: 40, padding: 0, border: 'none', cursor: 'pointer', borderRadius: 8, overflow: 'hidden' }}
            />
            <span style={{ fontSize: 13, color: '#64748b' }}>{createForm.color}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}