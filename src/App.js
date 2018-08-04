import React, { Component } from 'react';
import Button from 'antd/lib/button';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            docs-upload-site
          </h1>
        </header>
        <div class="App-content">
          <Button type="primary">
            Antd Works!
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
