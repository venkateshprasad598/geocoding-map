import React from 'react';
import { Form, Input, DatePicker, Button } from 'antd';
import type { LocationFormData } from '../../types/location';

interface LocationFormProps {
  onSubmit: (data: LocationFormData) => void;
  onCancel: () => void;
}

export function LocationForm({ onSubmit, onCancel }: LocationFormProps) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit({
      title: values.title,
      description: values.description,
      date: values.date.toISOString(),
    });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-full max-w-md"
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter a title' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item className="mb-0 flex justify-end space-x-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Save Location
        </Button>
      </Form.Item>
    </Form>
  );
}