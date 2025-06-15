'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin, message, Tag, Space, Button, Divider } from 'antd';
import { 
  SettingOutlined, 
  PlusOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import { useRouter } from 'next/navigation';
import criteriaService, { CreateCriteriaRequest, UpdateCriteriaRequest } from '../../services/CriteriaService';
import { Criteria } from '../../models/criteria';
import { UserType } from '../../models/userType';
import CriteriaModal from '../../components/CriteriaModal';

const { Title, Text, Paragraph } = Typography;

const CriteriaPage = () => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<Criteria | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { token, isAuthenticated, user } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      message.error('Please login to view criteria');
      router.push('/login');
      return;
    }    // Check if user is SuperAdmin (userType === 'SuperAdmin')
    if (user?.userType !== 'SuperAdmin') {
      message.error('Access denied. SuperAdmin privileges required.');
      router.push('/');
      return;
    }

    const fetchCriteria = async () => {
      try {
        setLoading(true);
        const criteriaData = await criteriaService.getCriteria(token);
        setCriteria(criteriaData);
      } catch (error: any) {
        message.error(error.message || 'Failed to load criteria');
      } finally {
        setLoading(false);
      }
    };    fetchCriteria();
  }, [token, isAuthenticated, user, router]);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const criteriaData = await criteriaService.getCriteria(token!);
      setCriteria(criteriaData);
    } catch (error: any) {
      message.error(error.message || 'Failed to load criteria');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCriteria = () => {
    setEditingCriteria(null);
    setIsEditMode(false);
    setModalVisible(true);
  };

  const handleEditCriteria = (criteria: Criteria) => {
    setEditingCriteria(criteria);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const handleModalSubmit = async (data: CreateCriteriaRequest | UpdateCriteriaRequest) => {
    setModalLoading(true);
    try {
      if (isEditMode) {
        await criteriaService.updateCriteria(data as UpdateCriteriaRequest, token!);
        message.success('Criteria updated successfully!');
      } else {
        await criteriaService.createCriteria(data as CreateCriteriaRequest, token!);
        message.success('Criteria created successfully!');
      }
      
      setModalVisible(false);
      setEditingCriteria(null);
      setIsEditMode(false);
      
      // Refresh criteria list
      await fetchCriteria();
    } catch (error: any) {
      message.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} criteria`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingCriteria(null);
    setIsEditMode(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'critical':
        return 'red';
      case 'important':
        return 'orange';
      case 'moderate':
        return 'blue';
      case 'optional':
        return 'green';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px' 
        }}>
          <div>
            <Title level={1}>
              <SettingOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Criteria Management
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#666', margin: 0 }}>
              Manage criteria used for planetary life habitability analysis
            </Paragraph>
          </div>
          
          <Button 
            type="primary" 
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddCriteria}
            style={{ 
              height: '48px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Add Criteria
          </Button>
        </div>        {/* Criteria Grid */}
        <Row gutter={[24, 24]}>
          {criteria.map((criterion) => (
            <Col xs={24} sm={12} lg={8} key={criterion.id}>
              <Card
                hoverable
                style={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                }}
                cover={
                  <div style={{ 
                    padding: '24px', 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                    color: 'white',
                    position: 'relative'
                  }}>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCriteria(criterion);
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    />
                    <SettingOutlined style={{ fontSize: '48px', marginBottom: '8px' }} />
                    <Title level={4} style={{ color: 'white', margin: 0 }}>
                      {criterion.name}
                    </Title>
                  </div>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {/* Category and Required Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tag color={getCategoryColor(criterion.category)}>
                      {criterion.category}
                    </Tag>
                    {criterion.isRequired ? (
                      <Tag color="red" icon={<ExclamationCircleOutlined />}>
                        Required
                      </Tag>
                    ) : (
                      <Tag color="blue" icon={<InfoCircleOutlined />}>
                        Optional
                      </Tag>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Text type="secondary">{criterion.description}</Text>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* Thresholds */}
                  <div>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Min Threshold:</Text>
                        <Text strong>{criterion.minimumThreshold} {criterion.unit}</Text>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Max Threshold:</Text>
                        <Text strong>{criterion.maximumThreshold} {criterion.unit}</Text>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Weight:</Text>
                        <Text strong>{criterion.weight}%</Text>
                      </div>
                    </Space>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* Metadata */}
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Created: {formatDate(criterion.createdDate)}
                    </Text>
                    {criterion.modifiedDate && (
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Modified: {formatDate(criterion.modifiedDate)}
                        </Text>
                      </div>
                    )}
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {criteria.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <SettingOutlined style={{ fontSize: '64px', color: '#ccc' }} />
            <Title level={3} type="secondary">No Criteria Found</Title>
            <Paragraph type="secondary">
              No criteria are currently defined. Click "Add Criteria" to create the first one.
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAddCriteria}
            >
              Add First Criteria
            </Button>          </div>
        )}
      </div>

      {/* Criteria Modal */}
      <CriteriaModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        criteria={editingCriteria}
        isEdit={isEditMode}
      />
    </div>
  );
};

export default CriteriaPage;
