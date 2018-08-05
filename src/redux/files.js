import Fetch from 'fetch-ponyfill';
import prefixApiPath from '../utils/prefixApiPath';

const { fetch } = Fetch();

export const FILES_REQUEST = 'files/FILES_REQUEST'
export const FILES_SUCCESS = 'files/FILES_SUCCESS'
export const FILES_ERRORED = 'files/FILES_ERRORED'

export const DELETE_REQUEST = 'files/DELETE_REQUEST'
export const DELETE_SUCCESS = 'files/DELETE_SUCCESS'
export const DELETE_ERRORED = 'files/DELETE_ERRORED'

const initialState = {
  query: null,
  files: [],
  loading: true,
  error: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FILES_REQUEST:
      return {
        ...state,
        query: action.query || null,
        loading: true
      }

    case FILES_SUCCESS:
      return {
        ...state,
        files: action.files || [],
        loading: false
      }

    case FILES_ERRORED:
      return {
        ...state,
        files: [],
        loading: false,
        error: action.error,
      }

    case DELETE_ERRORED:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state
  }
}

export const requestFiles = query => {
  let url = prefixApiPath('/list');
  if (query) {
    url = prefixApiPath(`/search/${query}`);
  }
  return async (dispatch) => {
    dispatch({
      type: FILES_REQUEST,
      query,
    });

    try {
      const res = await fetch(url);
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`HTTP status ${res.status}`);
      }
      const json = await res.json();
      const { files } = json;
      dispatch({
        type: FILES_SUCCESS,
        files,
      });
    } catch (error) {
      dispatch({
        type: FILES_ERRORED,
        error,
      });
      throw error;
    }
  };
}

export const deleteFile = fileName => {
  const url = prefixApiPath(`/delete/${fileName}`);
  return async (dispatch) => {
    dispatch({
      type: DELETE_REQUEST,
      fileName,
    });

    try {
      const res = await fetch(url, { method: 'POST' });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`HTTP status ${res.status}`);
      }
      dispatch({
        type: DELETE_SUCCESS,
        fileName,
      });
      dispatch(requestFiles());
    } catch (error) {
      dispatch({
        type: DELETE_ERRORED,
        error,
      });
      throw error;
    }
  };
}
