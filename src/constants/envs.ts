export default Object.freeze({
  API_HOST: import.meta.env.VITE_BASE_API_URL as string,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL as string,
  FRONT_URL: import.meta.env.VITE_FRONT_URL as string,
  S3_BUCKET: import.meta.env.VITE_S3_BUCKET as string,
  DATETIME_FORMAT: import.meta.env.VITE_DATETIME_FORMAT as string,
});
