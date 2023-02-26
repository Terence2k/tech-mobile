const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  storageNamespace: isDevelopment ? 'dev_h5_' : 'h5_',
};
