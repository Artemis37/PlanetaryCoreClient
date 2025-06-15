import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const CustomFooter = () => {
  return (
    <AntFooter style={{ 
      textAlign: 'center',
      backgroundColor: '#f0f2f5',
      padding: '24px 50px'
    }}>
      <div>
        <p style={{ margin: 0, color: '#666' }}>
          © 2025 ExoPlanet Life Predictor. Exploring the possibilities of life beyond Earth.
        </p>
      </div>
    </AntFooter>
  );
};

export default CustomFooter;
