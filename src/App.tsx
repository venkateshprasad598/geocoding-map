import React from 'react';
import { Layout } from 'antd';
import { MapPin } from 'lucide-react';
import { InteractiveMap } from './components/Map/InteractiveMap';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          {/* <h1 className="text-xl font-semibold text-gray-800">Police Location Tracker</h1> */}
        </div>
      </Header>
      <Content>
        <InteractiveMap />
      </Content>
    </Layout>
  );
}

export default App;