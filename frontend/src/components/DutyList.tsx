import React, { useState } from 'react';
import { Button, Input, List, Space, message, Form, Popconfirm } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { Duty } from '../types/duties';
import { updateDuty, deleteDuty } from '../services/dutiesApi';

interface DutyListProps {
  duties: Duty[];
  onUpdate: () => void;
}

const DutyList: React.FC<DutyListProps> = ({ duties, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleUpdate = async (id: string, name: string) => {
    try {
      await updateDuty(id, name);
      setEditingId(null);
      onUpdate();
      message.success('Duty updated');
    } catch (error) {
      message.error('Failed to update duty');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("handle duty");
      const success = await deleteDuty(id);
      console.log("handle duty done");
      if (success) {
        message.success('Duty deleted');
        onUpdate();
      } else {
        message.error('Failed to delete duty');
      }
    } catch {
      message.error('Failed to delete duty');
    }
  };

  return (
      <List
          bordered
          dataSource={duties}
          renderItem={(duty) => (
              <List.Item>
                {editingId === duty.id ? (
                    <Form
                        form={form}
                        initialValues={{ name: duty.name }}
                        onFinish={({ name }) => handleUpdate(duty.id, name)}
                        layout="inline"
                    >
                      <Form.Item
                          name="name"
                          rules={[
                            { required: true, message: 'Please enter a duty' },
                            { min: 3, message: 'Minimum 3 characters required' },
                          ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item>
                        <Button htmlType="submit" icon={<SaveOutlined />} aria-label="Save" />
                      </Form.Item>
                      <Form.Item>
                        <Popconfirm
                            title="Are you sure to delete this duty?"
                            onConfirm={() => handleDelete(duty.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                          <Button danger icon={<DeleteOutlined />} aria-label="Delete" />
                        </Popconfirm>
                      </Form.Item>
                      <Form.Item>
                        <Button icon={<CloseOutlined />} aria-label="Cancel" onClick={() => setEditingId(null)} type="link" />
                      </Form.Item>
                    </Form>
                ) : (
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <span>{duty.name}</span>
                      <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingId(duty.id);
                            form.setFieldsValue({ name: duty.name });
                          }}
                          aria-label="Edit"
                      />
                    </Space>
                )}
              </List.Item>
          )}
      />
  );
};

export default DutyList;
