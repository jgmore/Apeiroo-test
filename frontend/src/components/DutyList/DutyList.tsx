import React, { useState } from 'react';
import { List, Input, Button, Typography, message } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Duty } from '../../App';
import config from '../../config.json';

interface Props {
  duties: Duty[];
  onUpdate: () => void;
}

const DutyList: React.FC<Props> = ({ duties, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const handleUpdate = async (id: string, name: string) => {
    try {
      await fetch(`${config.API_URL}/duties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      setEditingId(null);
      onUpdate();
    } catch {
      message.error('Failed to update duty');
    }
  };

  return (
    <List
      bordered
      dataSource={duties}
      renderItem={(duty) => (
        <List.Item
          actions={[
            editingId === duty.id ? (
              <Button
                key="save"
                icon={<SaveOutlined />}
                onClick={() => handleUpdate(duty.id, editText)}
              />
            ) : (
              <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingId(duty.id);
                  setEditText(duty.name);
                }}
              />
            ),
          ]}
        >
          {editingId === duty.id ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <Typography.Text>{duty.name}</Typography.Text>
          )}
        </List.Item>
      )}
    />
  );
};

export default DutyList;
