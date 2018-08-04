import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Upload, Spin, Button, Input } from 'antd';
import filesize from 'filesize';

import './FilesList.css';

import {
  requestFiles,
} from '../redux/files';

const mapStateToProps = ({ files: { files, query, loading, error } }) => ({
  files, query, loading, error,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestFiles,
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
          message="No files available"
          description="There are no files uploaded."
          type="info"
          showIcon
        />
      );
    }
    const fileList = files.map(({ name, size }, idx) => ({
      uid: idx,
      name: `${name} (${filesize(size)})`,
      status: 'done',
      url: `/uploads/${name}`,
    }));
    const props = {
      action: '',
      listType: 'picture',
      defaultFileList: [...fileList],
      className: 'upload-list-inline',
    };
    return (
      <Fragment>
        <Input.Search
          placeholder="input and press enter…"
          defaultValue={this.props.query}
          onSearch={value => {
            this.props.requestFiles(value);
          }}
          style={{ width: 200 }}
        />
        {this.props.query ? (
          <Button
            type="primary"
            onClick={() => { this.props.requestFiles(); }}
          >
            Clear
          </Button>
        ) : null}
        <Upload {...props} />
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesList);
