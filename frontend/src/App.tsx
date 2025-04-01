import React, { useEffect, useState } from 'react';
import { Layout, Typography, message } from 'antd';
import { fetchDuties } from './services/dutiesApi';
import { Duty } from './types/duties';
import AddDutyForm from './components/AddDutyForm';
import DutyList from './components/DutyList';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [duties, setDuties] = useState<Duty[]>([]);

  const loadDuties = async () => {
    try {
      const data = await fetchDuties();
      setDuties(data);
    } catch (error) {
      message.error('Failed to fetch duties');
    }
  };

  useEffect(() => {
    loadDuties();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <Title style={{ color: '#fff' }} level={2}>To-Do List Of Duties App</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <AddDutyForm onAddSuccess={loadDuties} />
        <DutyList duties={duties} onUpdate={loadDuties} />
      </Content>
    </Layout>
  );
};

export default App;