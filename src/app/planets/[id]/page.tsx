'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin, message, Tag, Space, Button, Divider, Statistic, Progress } from 'antd';
import { 
  GlobalOutlined, 
  EnvironmentOutlined,
  FireOutlined,
  DropboxOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../../../store/hooks';
import { useRouter, useParams } from 'next/navigation';
import planetService from '../../../services/PlanetService';
import { PlanetDetail, PlanetCriteriaFlat } from '../../../models/planet';
import { log } from 'console';

const { Title, Text, Paragraph } = Typography;

const PlanetDetailPage = () => {
  const [planet, setPlanet] = useState<PlanetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAppSelector((state) => state.user);
  const router = useRouter();
  const params = useParams();
  const planetId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated || !token) {
      message.error('Please login to view planet details');
      router.push('/login');
      return;
    }

    const fetchPlanetDetail = async () => {
      try {
        setLoading(true);
        const planetData = await planetService.getPlanetDetail(planetId, token);
        setPlanet(planetData);
      } catch (error: any) {
        message.error(error.message || 'Failed to load planet details');
        router.push('/planets');
      } finally {
        setLoading(false);
      }
    };

    if (planetId) {
      fetchPlanetDetail();
    }
  }, [planetId, token, isAuthenticated, router]);

  const handleAddCriteria = () => {
    message.info('Add criteria functionality will be implemented later');
  };

  const handleEditCriteria = (criteriaId: string) => {
    message.info('Edit criteria functionality will be implemented later');
  };

  const formatTemperature = (temp: number) => {
    return `${temp}K (${(temp - 273.15).toFixed(1)}°C)`;
  };

  const formatDistance = (distance: number) => {
    if (distance === 0) return 'Home Planet';
    if (distance < 1) return `${(distance * 149.6).toFixed(1)} million km`;
    return `${distance.toFixed(2)} AU`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (!planet) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <GlobalOutlined style={{ fontSize: '64px', color: '#ccc' }} />
        <Title level={3} type="secondary">Planet Not Found</Title>
        <Button onClick={() => router.push('/planets')}>
          Back to Planets
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push('/planets')}
            style={{ marginBottom: '16px' }}
          >
            Back to Planets
          </Button>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '40px',
            color: 'white',
            textAlign: 'center'
          }}>
            <GlobalOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
            <Title level={1} style={{ color: 'white', margin: 0 }}>
              {planet.name}
            </Title>
            <Text style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>
              {planet.stellarSystem}
            </Text>
            <div style={{ marginTop: '16px' }}>
              <Tag color={planet.planetType === 'Terrestrial' ? 'green' : 'blue'} style={{ fontSize: '14px' }}>
                {planet.planetType}
              </Tag>
            </div>
          </div>
        </div>

        {/* Planet Information */}
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          <Col xs={24} lg={16}>
            <Card title="Physical Characteristics" style={{ height: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Distance from Earth"
                    value={formatDistance(planet.distanceFromEarth)}
                    prefix={<EnvironmentOutlined />}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Radius"
                    value={`${planet.radius.toLocaleString()} km`}
                    prefix={<GlobalOutlined />}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Mass"
                    value={`${planet.mass} Earth masses`}
                    prefix={<ThunderboltOutlined />}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Surface Temperature"
                    value={formatTemperature(planet.surfaceTemperature)}
                    prefix={<FireOutlined />}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Surface Gravity"
                    value={`${planet.surfaceGravity}g`}
                    prefix={<ThunderboltOutlined />}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Discovery Date"
                    value={formatDate(planet.discoveryDate)}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Atmospheric & Environmental" style={{ height: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <Text strong>Atmosphere:</Text>
                  <div style={{ marginTop: '8px' }}>
                    {planet.hasAtmosphere ? (
                      <Tag color="blue" icon={<ExperimentOutlined />}>
                        Present
                      </Tag>
                    ) : (
                      <Tag color="red">
                        None
                      </Tag>
                    )}
                  </div>
                  {planet.hasAtmosphere && (
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {planet.atmosphericComposition}
                      </Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Pressure: {planet.atmosphericPressure} atm
                        </Text>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Text strong>Water:</Text>
                  <div style={{ marginTop: '8px' }}>
                    {planet.hasWater ? (
                      <Tag color="cyan" icon={<DropboxOutlined />}>
                        {planet.waterCoverage}% Coverage
                      </Tag>
                    ) : (
                      <Tag color="red">
                        No Water Detected
                      </Tag>
                    )}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Criteria Section */}
        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Habitability Criteria</span>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddCriteria}
              >
                Add Criteria
              </Button>
            </div>
          }
        >
          {planet.criteria && planet.criteria.length > 0 ? (
            <Row gutter={[16, 16]}>
              {planet.criteria.map((criteria, index) => (
                <Col xs={24} sm={12} lg={8} key={criteria.criteriaId}>
                  <Card
                    size="small"
                    style={{ 
                      border: criteria.isMet ? '2px solid #52c41a' : '2px solid #ff4d4f',
                      backgroundColor: criteria.isMet ? '#f6ffed' : '#fff2f0'
                    }}
                    extra={
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditCriteria(criteria.criteriaId)}
                      />
                    }
                  >                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      {criteria.isMet ? (
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                      )}                      <div style={{ flex: 1 }}>
                        <Text strong>{criteria.criteriaName || `Unknown`}</Text>
                        {criteria.criteriaCategory && (
                          <div style={{ marginTop: '2px' }}>
                            <Tag 
                              color={
                                criteria.criteriaCategory === 'Critical' ? 'red' :
                                criteria.criteriaCategory === 'Important' ? 'orange' :
                                criteria.criteriaCategory === 'Moderate' ? 'blue' : 'green'
                              }
                              style={{ fontSize: '11px' }}
                            >
                              {criteria.criteriaCategory}
                            </Tag>
                          </div>
                        )}
                      </div>
                    </div>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>                      <div>                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text type="secondary">Value:</Text>
                          {criteria.unit && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              ({criteria.unit})
                            </Text>
                          )}
                        </div>
                        <div style={{ marginTop: '4px' }}>                          <Progress 
                            percent={criteria.value} 
                            strokeColor={criteria.isMet ? '#52c41a' : '#ff4d4f'}
                            size="small"
                            format={(percent) => `${percent}${criteria.unit ? ` ${criteria.unit}` : '%'}`}
                          />
                        </div>                        {criteria.criteriaDescription && (
                          <Text type="secondary" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                            {criteria.criteriaDescription}
                          </Text>
                        )}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Score:</Text>
                        <Text strong style={{ color: criteria.isMet ? '#52c41a' : '#ff4d4f' }}>
                          {criteria.score}/10
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Status:</Text>
                        <Tag color={criteria.isMet ? 'success' : 'error'}>
                          {criteria.isMet ? 'Met' : 'Not Met'}
                        </Tag>
                      </div>
                      {criteria.notes && (
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Notes: {criteria.notes}
                          </Text>
                        </div>
                      )}
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <ExperimentOutlined style={{ fontSize: '48px', color: '#ccc' }} />
              <Title level={4} type="secondary">No Criteria Defined</Title>
              <Paragraph type="secondary">
                No habitability criteria have been defined for this planet yet.
              </Paragraph>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddCriteria}
              >
                Add First Criteria
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PlanetDetailPage;
