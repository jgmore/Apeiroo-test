import React, { useEffect, useState } from 'react';
import { Typography, Layout, message } from 'antd';
import AddDutyForm from './components/AddDutyForm/AddDutyForm';
import DutyList from './components/DutyList/DutyList';
import config from './config.json';

const { Header, Content } = Layout;

export interface Duty {
  id: string;
  name: string;
}

const App: React.FC = () => {
  const [duties, setDuties] = useState<Duty[]>([]);

  const fetchDuties = async () => {
    try {
      const res = await fetch(`${config.API_URL}/duties`);
      const data: Duty[] = await res.json();
      setDuties(data);
    } catch {
      message.error('Failed to fetch duties');
    }
  };

  useEffect(() => {
    fetchDuties();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <Typography.Title style={{ color: '#fff', margin: 0 }} level={3}>
          To-Do List App
        </Typography.Title>
      </Header>
      <Content style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
        <AddDutyForm onAddSuccess={fetchDuties} />
        <DutyList duties={duties} onUpdate={fetchDuties} />
      </Content>
    </Layout>
  );
};

export default App;
