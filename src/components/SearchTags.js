import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tag as _Tag } from 'antd';

import {
  requestFiles,
} from '../redux/files';

const Tag = _Tag.CheckableTag;

const mapStateToProps = ({ files: { query } }) => ({ query });

const mapDispatchToProps = dispatch => bindActionCreators({
  requestFiles,
}, dispatch);

const makeHandler = (props, query) =>
  () => props.requestFiles(query);

const makeTag = (props, query, label) => (
  <Tag
    onChange={makeHandler(props, query)}
    checked={props.query === query}
  >
    {label || query}
  </Tag>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(props => (
  <div
    className="hidden-mobile"
    style={{ maxWidth: '350px' }}
  >
    {makeTag(props, null, 'all')}
    {makeTag(props, '.pdf')}
    {makeTag(props, '.doc')}
    {makeTag(props, '.xls')}
    {makeTag(props, '.jpg')}
    {makeTag(props, '.png')}
    {makeTag(props, '.mov')}
  </div>
));
