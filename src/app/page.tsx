'use client'

import { Button, Card, Row, Col, Typography, Space, Divider, Checkbox, CheckboxProps } from "antd";
import { RocketOutlined, GlobalOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useState } from "react";

const { Title, Paragraph } = Typography;

const Home = () => {

  return (
    <div style={{ padding: '50px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={1} style={{ fontSize: '3rem', marginBottom: '20px' }}>
          Discover Life Beyond Earth
        </Title>
        <Paragraph style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Use advanced algorithms to predict the likelihood of planets supporting life 
          based on key astronomical and atmospheric criteria.
        </Paragraph>
        <Space style={{ marginTop: '30px' }}>
          <Button type="primary" size="large" icon={<RocketOutlined />}>
            Start Prediction
          </Button>
          <Button size="large">
            Learn More
          </Button>
        </Space>
      </div>

      <Divider />

      {/* Features Section */}
      <div style={{ marginBottom: '60px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          Key Criteria We Analyze
        </Title>
        
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={8}>
            <Card 
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ padding: '40px', fontSize: '4rem', color: '#1890ff' }}>
                  <GlobalOutlined />
                </div>
              }
            >
              <Card.Meta 
                title="Habitable Zone" 
                description="Distance from the star that allows liquid water to exist on the planet's surface."
              />
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ padding: '40px', fontSize: '4rem', color: '#52c41a' }}>
                  <ExperimentOutlined />
                </div>
              }
            >
              <Card.Meta 
                title="Atmospheric Composition" 
                description="Analysis of gases that could support life, including oxygen, carbon dioxide, and water vapor."
              />
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ padding: '40px', fontSize: '4rem', color: '#faad14' }}>
                  <RocketOutlined />
                </div>
              }
            >
              <Card.Meta 
                title="Planet Characteristics" 
                description="Size, mass, orbital period, and surface conditions that affect habitability potential."
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Title level={2}>Ready to Explore?</Title>
        <Paragraph style={{ fontSize: '1.1rem', marginBottom: '30px' }}>
          Start analyzing exoplanets and discover which ones might harbor life.
        </Paragraph>
        <Button type="primary" size="large" icon={<RocketOutlined />}>
          Begin Analysis
        </Button>
      </div>
    </div>
  );
} 

export default Home;