const DEV_API_PREFIX = 'http://localhost:8081';
const PROD_API_PREFIX = '';

export default (path) => {
  if (process.env.NODE_ENV === 'production') {
    return `${PROD_API_PREFIX}${path}`;
  } else {
    return `${DEV_API_PREFIX}${path}`;
  }
};
