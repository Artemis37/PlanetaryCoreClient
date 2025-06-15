'use client';

import { Modal, Form, Input, InputNumber, Select, Switch, message, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Criteria } from '../models/criteria';
import { PlanetCriteriaFlat, UpdatePlanetCriteria } from '../models/planet';
import criteriaService from '../services/CriteriaService';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface PlanetCriteriaModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: UpdatePlanetCriteria) => void;
  loading: boolean;
  planetCriteria?: PlanetCriteriaFlat | null;
  isEdit?: boolean;
  token: string;
  existingCriteria?: PlanetCriteriaFlat[];
}

const PlanetCriteriaModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  loading, 
  planetCriteria, 
  isEdit = false,
  token,
  existingCriteria = []
}: PlanetCriteriaModalProps) => {
  const [form] = Form.useForm();
  const [availableCriteria, setAvailableCriteria] = useState<Criteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
  const [loadingCriteria, setLoadingCriteria] = useState(false);  useEffect(() => {
    if (visible && !isEdit) {
      fetchAvailableCriteria();
    }
  }, [visible, isEdit, existingCriteria, token]);

  useEffect(() => {
    if (visible) {
      if (isEdit && planetCriteria) {
        // Fill form with existing planet criteria data
        form.setFieldsValue({
          criteriaId: planetCriteria.criteriaId,
          value: planetCriteria.value,
          score: planetCriteria.score,
          isMet: planetCriteria.isMet,
          notes: planetCriteria.notes,
        });
        
        // Set selected criteria for display
        setSelectedCriteria({
          id: planetCriteria.criteriaId,
          name: planetCriteria.criteriaName,
          description: planetCriteria.criteriaDescription,
          category: planetCriteria.criteriaCategory,
          minimumThreshold: planetCriteria.minimumThreshold,
          maximumThreshold: planetCriteria.maximumThreshold,
          unit: planetCriteria.unit,
          weight: planetCriteria.weight,
          isRequired: planetCriteria.isRequired,
          createdDate: '',
          modifiedDate: null,
          planetCriteria: []
        });
      } else {
        // Reset form for new criteria
        form.resetFields();
        setSelectedCriteria(null);
      }
    }
  }, [visible, isEdit, planetCriteria, form]);
    
  const fetchAvailableCriteria = async () => {
    try {
      setLoadingCriteria(true);
      const data = await criteriaService.getCriteria(token);
      
      // Filter out criteria that are already added to the planet
      const existingCriteriaIds = existingCriteria.map(c => c.criteriaId);
      const filteredCriteria = data.filter(criteria => !existingCriteriaIds.includes(criteria.id));
      
      setAvailableCriteria(filteredCriteria);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch criteria');
    } finally {
      setLoadingCriteria(false);
    }
  };

  const handleCriteriaChange = (criteriaId: string) => {
    const criteria = availableCriteria.find(c => c.id === criteriaId);
    setSelectedCriteria(criteria || null);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
    const formData: UpdatePlanetCriteria = {
      criteriaId: selectedCriteria?.id || '00000000-0000-0000-0000-000000000000',
      value: values.value,
      score: values.score,
      isMet: values.isMet,
      notes: values.notes || '',
    };
      onSubmit(formData);
    }).catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedCriteria(null);
    onCancel();
  };
  
  return (
    <Modal
      title={isEdit ? 'Edit Planet Criteria' : 'Add Planet Criteria'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
      okButtonProps={{
        disabled: !isEdit && availableCriteria.length === 0
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isMet: false,
          score: 0,
          value: 0,
        }}
      >        {!isEdit && (
          <>
            <Form.Item
              name="criteriaId"
              label="Criteria"
              rules={[{ required: true, message: 'Please select a criteria!' }]}
            >
              <Select
                placeholder={availableCriteria.length === 0 ? "No criteria available to add" : "Select a criteria"}
                loading={loadingCriteria}
                onChange={handleCriteriaChange}
                showSearch
                optionFilterProp="children"
                disabled={availableCriteria.length === 0}
                notFoundContent={loadingCriteria ? "Loading..." : "No criteria available"}
              >
                {availableCriteria.map((criteria) => (
                  <Option key={criteria.id} value={criteria.id}>
                    {criteria.name} - {criteria.category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {availableCriteria.length === 0 && !loadingCriteria && (
              <div style={{ 
                background: '#fff7e6', 
                border: '1px solid #ffd591',
                padding: '12px', 
                borderRadius: '6px', 
                marginBottom: '16px' 
              }}>
                <Text type="warning">
                  All available criteria have been added to this planet.
                </Text>
              </div>
            )}
          </>
        )}

        {selectedCriteria && (
          <div style={{ 
            background: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px' 
          }}>
            <Text strong>{selectedCriteria.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {selectedCriteria.description}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Range: {selectedCriteria.minimumThreshold} - {selectedCriteria.maximumThreshold} {selectedCriteria.unit}
            </Text>
          </div>
        )}        
        <Form.Item
          name="value"
          label={`Value ${selectedCriteria?.unit ? `(${selectedCriteria.unit})` : ''} (0-100)`}
          rules={[
            { required: true, message: 'Please enter a value!' },
            ...(selectedCriteria ? [{
              validator: (_: any, value: any) => {
                if (value >= selectedCriteria.minimumThreshold && value <= selectedCriteria.maximumThreshold) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(`Value must be between ${selectedCriteria.minimumThreshold} and ${selectedCriteria.maximumThreshold}`));
              }
            }] : [])
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter value"
          />
        </Form.Item>

        <Form.Item
          name="score"
          label="Score (0-10)"
          rules={[
            { required: true, message: 'Please enter a score!' },
            { type: 'number', min: 0, max: 10, message: 'Score must be between 0 and 10!' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={10}
            placeholder="Enter score"
          />
        </Form.Item>

        <Form.Item
          name="isMet"
          label="Criteria Met"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea
            rows={4}
            placeholder="Enter any additional notes..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlanetCriteriaModal;
