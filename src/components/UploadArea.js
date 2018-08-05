import React from 'react';
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

let lastStatus;
const props = p => ({
  name: 'file',
  action: prefixApiPath('/upload'),
  showUploadList: false,
  onChange(info) {
    const status = info.file.status;
    if (status === lastStatus) return;
    lastStatus = status;
    if (status === 'uploading') {
        message.loading('Uploading the file…', 0);
    } else message.destroy();
    if (status === 'done') {
      p.requestFiles();
      setTimeout(() => {
        message.success(`"${info.file.name}" was uploaded successfully.`);
      }, 0);
    } else if (status === 'error') {
      message.error(`Upload of "${info.file.name}" has failed. Max size is 10MB.`);
    }
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(p => (
  <Dragger {...props(p)}>
    <p className="ant-upload-drag-icon">
      <Icon type="inbox" />
    </p>
    <p className="ant-upload-text">
      Click or drag file to this area to upload
    </p>
  </Dragger>
));
