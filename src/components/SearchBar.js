import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Input } from 'antd';
import SearchTags from './SearchTags';

import {
  requestFiles,
} from '../redux/files';

const mapStateToProps = ({ files: { query } }) => ({ query });

const mapDispatchToProps = dispatch => bindActionCreators({
  requestFiles,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(props => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Input.Search
      className="fullwidth-mobile"
      style={{ width: '250px' }}
      placeholder="search for files…"
      defaultValue={props.query}
      onSearch={value => {
        props.requestFiles(value);
      }}
      enterButton
    />
    <SearchTags />
  </div>
));
