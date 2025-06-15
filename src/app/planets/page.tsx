'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin, message, Tag, Space, Divider } from 'antd';
import { 
  GlobalOutlined, 
  ExperimentOutlined, 
  FireOutlined, 
  DropboxOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined 
} from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import { useRouter } from 'next/navigation';
import planetService from '../../services/PlanetService';
import { Planet } from '../../models/planet';

const { Title, Text, Paragraph } = Typography;

const PlanetsPage = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      message.error('Please login to view planets');
      router.push('/login');
      return;
    }

    const fetchPlanets = async () => {
      try {
        setLoading(true);
        const planetsData = await planetService.getPlanets(token);
        setPlanets(planetsData);
      } catch (error: any) {
        message.error(error.message || 'Failed to load planets');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanets();
  }, [token, isAuthenticated, router]);
  const handlePlanetClick = (planetId: string) => {
    router.push(`/planets/${planetId}`);
  };

  const formatTemperature = (temp: number) => {
    return `${temp}K (${(temp - 273.15).toFixed(1)}°C)`;
  };

  const formatDistance = (distance: number) => {
    if (distance === 0) return 'Home Planet';
    if (distance < 1) return `${(distance * 149.6).toFixed(1)} million km`;
    return `${distance.toFixed(2)} AU`;
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
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1}>
            <GlobalOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            Planetary Database
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            Explore planets and their characteristics for life habitability analysis
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {planets.map((planet) => (
            <Col xs={24} sm={12} lg={8} key={planet.id}>
              <Card
                hoverable
                onClick={() => handlePlanetClick(planet.id)}
                style={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                cover={
                  <div style={{ 
                    padding: '24px', 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <GlobalOutlined style={{ fontSize: '48px', marginBottom: '8px' }} />
                    <Title level={3} style={{ color: 'white', margin: 0 }}>
                      {planet.name}
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {planet.stellarSystem}
                    </Text>
                  </div>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {/* Planet Type */}
                  <div>
                    <Tag color={planet.planetType === 'Terrestrial' ? 'green' : 'blue'}>
                      {planet.planetType}
                    </Tag>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text><EnvironmentOutlined /> Distance:</Text>
                        <Text strong>{formatDistance(planet.distanceFromEarth)}</Text>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text><FireOutlined /> Temperature:</Text>
                        <Text strong>{formatTemperature(planet.surfaceTemperature)}</Text>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text><ThunderboltOutlined /> Gravity:</Text>
                        <Text strong>{planet.surfaceGravity}g</Text>
                      </div>
                    </Space>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* Life Indicators */}
                  <div>
                    <Space wrap>
                      {planet.hasAtmosphere && (
                        <Tag color="blue" icon={<ExperimentOutlined />}>
                          Atmosphere
                        </Tag>
                      )}
                      {planet.hasWater && (
                        <Tag color="cyan" icon={<DropboxOutlined />}>
                          Water ({planet.waterCoverage}%)
                        </Tag>
                      )}
                    </Space>
                  </div>

                  {/* Atmospheric Composition */}
                  {planet.hasAtmosphere && (
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Atmosphere: {planet.atmosphericComposition}
                      </Text>
                    </div>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {planets.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <GlobalOutlined style={{ fontSize: '64px', color: '#ccc' }} />
            <Title level={3} type="secondary">No Planets Found</Title>
            <Paragraph type="secondary">
              No planets are currently available in the database.
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanetsPage;
