'use client';

import { Modal, Form, Input, InputNumber, Select, Switch, message } from 'antd';
import { useEffect } from 'react';
import { Criteria } from '../models/criteria';
import { CreateCriteriaRequest, UpdateCriteriaRequest } from '../services/CriteriaService';

const { Option } = Select;
const { TextArea } = Input;

interface CriteriaModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateCriteriaRequest | UpdateCriteriaRequest) => void;
  loading: boolean;
  criteria?: Criteria | null;
  isEdit?: boolean;
}

const CriteriaModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  loading, 
  criteria, 
  isEdit = false 
}: CriteriaModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (isEdit && criteria) {
        // Fill form with existing criteria data
        form.setFieldsValue({
          name: criteria.name,
          description: criteria.description,
          category: criteria.category,
          minimumThreshold: criteria.minimumThreshold,
          maximumThreshold: criteria.maximumThreshold,
          unit: criteria.unit,
          weight: criteria.weight,
          isRequired: criteria.isRequired,
        });
      } else {
        // Reset form for new criteria
        form.resetFields();
      }
    }
  }, [visible, isEdit, criteria, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEdit && criteria) {
        // Update criteria
        const updateData: UpdateCriteriaRequest = {
          id: criteria.id,
          ...values,
        };
        onSubmit(updateData);
      } else {
        // Create new criteria
        onSubmit(values as CreateCriteriaRequest);
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? 'Edit Criteria' : 'Add New Criteria'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={isEdit ? 'Update' : 'Create'}
      cancelText="Cancel"
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          category: 'Critical',
          weight: 50,
          isRequired: true,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: 'Please enter criteria name!' },
            { min: 2, message: 'Name must be at least 2 characters!' }
          ]}
        >
          <Input placeholder="Enter criteria name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Please enter description!' },
            { min: 10, message: 'Description must be at least 10 characters!' }
          ]}
        >
          <TextArea 
            rows={3} 
            placeholder="Enter detailed description of the criteria"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select placeholder="Select category">
            <Option value="Critical">Critical</Option>
            <Option value="Important">Important</Option>
            <Option value="Moderate">Moderate</Option>
            <Option value="Optional">Optional</Option>
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="minimumThreshold"
            label="Minimum Threshold"
            rules={[{ required: true, message: 'Please enter minimum threshold!' }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Min value"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="maximumThreshold"
            label="Maximum Threshold"
            rules={[{ required: true, message: 'Please enter maximum threshold!' }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Max value"
              min={0}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[
              { required: true, message: 'Please enter unit!' },
              { min: 1, message: 'Unit cannot be empty!' }
            ]}
            style={{ flex: 1 }}
          >
            <Input placeholder="e.g., °C, km, %" />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight (%)"
            rules={[
              { required: true, message: 'Please enter weight!' },
              { type: 'number', min: 0, max: 100, message: 'Weight must be between 0 and 100!' }
            ]}
            style={{ flex: 1 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0-100"
              min={0}
              max={100}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="isRequired"
          label="Required"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Required" 
            unCheckedChildren="Optional"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CriteriaModal;
