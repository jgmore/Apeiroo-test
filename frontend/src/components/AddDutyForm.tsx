import React from 'react';
import { Form, Input, Button, message, Space } from 'antd';
import { createDuty } from '../services/dutiesApi';
import {extractErrorMessage} from './utilities'
import DOMPurify from 'dompurify';

interface AddDutyFormProps {
  onAddSuccess: () => void;
}

const AddDutyForm: React.FC<AddDutyFormProps> = ({ onAddSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string }) => {
    try {
      const sanitizedInput = DOMPurify.sanitize(values.name);
      await createDuty(sanitizedInput);
      form.resetFields();
      onAddSuccess();
	  message.success('Duty added');
    } catch (error: unknown) {
        const errorMessage = extractErrorMessage(error);
        message.error(`Failed to add duty: ${errorMessage}`);
    }
  };

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item
        name="name"
        rules={[
          { required: true, message: 'Please enter a duty' },
          { min: 3, message: 'Minimum 3 characters required' },
        ]}
      >
        <Input placeholder="New Duty" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
          <Button onClick={onAddSuccess}>Refresh</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddDutyForm;