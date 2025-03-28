import React, { useState } from 'react';
import { Button, Input, Space, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import config from '../../config.json';

interface Props {
  onAddSuccess: () => void;
}

const AddDutyForm: React.FC<Props> = ({ onAddSuccess }) => {
  const [newDuty, setNewDuty] = useState<string>('');

  const handleAdd = async () => {
    if (!newDuty.trim()) return;

    try {
      await fetch(`${config.API_URL}/duties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDuty }),
      });
      setNewDuty('');
      onAddSuccess();
    } catch {
      message.error('Failed to add duty');
    }
  };

  return (
    <Space.Compact style={{ width: '100%', marginBottom: '1rem' }}>
      <Input
        placeholder="Enter new duty"
        value={newDuty}
        onChange={(e) => setNewDuty(e.target.value)}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add
      </Button>
      <Button icon={<ReloadOutlined />} onClick={onAddSuccess}>
        Refresh
      </Button>
    </Space.Compact>
  );
};

export default AddDutyForm;
