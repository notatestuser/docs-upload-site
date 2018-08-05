import React from 'react';
import { Layout, Divider } from 'antd';

import UploadArea from './components/UploadArea';
import SearchBar from './components/SearchBar';
import FilesList from './components/FilesList';

import './App.css';

const { Header, Content, Footer } = Layout;

const STYLE_HEIGHT = { height: '100%' };

const Section = ({ margin, children }) => (
  <div style={{ marginBottom: margin || '50px' }}>
    {children}
  </div>
);

export default () => (
  <div style={STYLE_HEIGHT}>
    <Layout className="App" style={STYLE_HEIGHT}>
      <Header className="App-header">
        <h1 className="App-title">
          Simple File Uploader
        </h1>
      </Header>
      <Content className="App-content">
        <Section>
          <UploadArea />
        </Section>
        <Divider>
          Uploaded files
        </Divider>
        <Section margin="15px">
          <SearchBar />
        </Section>
        <Section>
          <FilesList />
        </Section>
      </Content>
      <Footer className="App-footer" />
    </Layout>
  </div>
);
