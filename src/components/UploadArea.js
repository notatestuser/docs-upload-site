import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Upload, Icon, message } from 'antd';
import prefixApiPath from '../utils/prefixApiPath';

import {
  requestFiles,
} from '../redux/files';

const Dragger = Upload.Dragger;

const mapDispatchToProps = dispatch => bindActionCreators({
  requestFiles,
}, dispatch);

const props = requestFiles => ({
  name: 'file',
  multiple: false,
  action: prefixApiPath('/upload'),
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      requestFiles();
    } else if (status === 'error') {
      message.error(`Upload of "${info.file.name}" has failed. Max size is 10MB.`);
    }
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(({ requestFiles }) => (
  <Dragger {...props(requestFiles)}>
    <p className="ant-upload-drag-icon">
      <Icon type="inbox" />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
  </Dragger>
));
