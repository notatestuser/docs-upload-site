import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Upload, Spin, Modal, message } from 'antd';
import filesize from 'filesize';

import './FilesList.css';

import {
  requestFiles,
  deleteFile,
} from '../redux/files';

const mapStateToProps = ({ files: { files, query, loading, error } }) => ({
  files, query, loading, error,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestFiles,
  deleteFile,
}, dispatch);

class FilesList extends Component {
  static defaultProps = {
    files: [],
  }

  componentDidMount() {
    const { requestFiles } = this.props;
    requestFiles();
  }

  render() {
    const { files, loading, error } = this.props;
    if (loading) {
      return <Spin size="large" />;
    }
    if (error) {
      return (
        <Alert
          message="Error"
          description="An error has occurred. Is the server reachable?"
          type="error"
          showIcon
        />
      );
    }
    if (!files.length) {
      return (
        <Alert
          message="No files to show"
          description="Nothing matched the given search."
          type="info"
          showIcon
        />
      );
    }
    const fileList = files.map(({ name, size }, idx) => ({
      uid: idx,
      actualName: name,
      name: `${name} (${filesize(size)})`,
      status: 'done',
      url: `/uploads/${name}`,
    }));
    const props = {
      action: '',
      listType: 'picture',
      defaultFileList: [...fileList],
      className: 'upload-list-inline',
      onRemove: async ({ actualName }) =>
        new Promise((resolve, reject) => {
          Modal.confirm({
            title: `Do you want to remove "${actualName}"?`,
            content: 'This action cannot be reversed.',
            onOk: async () => {
              try {
                await this.props.deleteFile(actualName);
                message.info(`"${actualName}" was removed.`);
                resolve();
              } catch (e) {
                message.error(`Removing "${actualName}" has failed.`);
                reject();
              }
            },
          });
        }),
    };
    return <Upload {...props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesList);
