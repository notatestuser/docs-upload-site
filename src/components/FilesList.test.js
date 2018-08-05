import React from 'react';
import renderer from 'react-test-renderer';
import { FilesList } from './FilesList';

it('passes a snapshot test with 2 files', () => {
  const props = {
    files: [
      { name: "file1.jpg", size: 1 },
      { name: "file2.pdf", size: 2 },
    ],
    loading: false,
    requestFiles: () => {},
  }
  const tree = renderer.create(
    <FilesList {...props} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders list items for 2 files', () => {
  const props = {
    files: [
      { name: "file1.jpg", size: 1 },
      { name: "file2.pdf", size: 2 },
    ],
    loading: false,
    requestFiles: () => {},
  }
  const rendered = renderer.create(
    <FilesList {...props} />
  );
  const instance = rendered.root;
  expect(instance.findByProps({ title: 'file1.jpg (1 B)' }).type).toEqual('a');
  expect(instance.findByProps({ title: 'file2.pdf (2 B)' }).type).toEqual('a');
});
