import React, { Component } from 'react';
import { Layout, Divider } from 'antd';

import UploadArea from './components/UploadArea';
import FilesList from './components/FilesList';

import logo from './logo.svg';
import './App.css';

const { Header, Content, Footer } = Layout;

const STYLE_HEIGHT = { height: '100%' };

const Section = ({ children }) => (
  <div style={{ marginBottom: '40px' }}>
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
      <Content class="App-content">
        <Section>
          <UploadArea />
        </Section>
        <Divider>
          Uploaded files
        </Divider>
        <Section>
          <FilesList />
        </Section>
      </Content>
      <Footer class="App-footer" />
    </Layout>
  </div>
);
