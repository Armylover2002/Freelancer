import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const publicClient = axios.create({
  baseURL: `${baseURL}/public`,
  withCredentials: true,
  timeout: 15000,
});

export const adminClient = axios.create({
  baseURL: `${baseURL}/admin`,
  withCredentials: true,
  timeout: 15000,
});

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}

function unwrapFull(promise) {
  return promise.then((res) => ({ data: res.data.data, meta: res.data.meta }));
}

export function extractErrorMessage(err) {
  return (
    err?.response?.data?.error?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  );
}

export function extractErrorDetails(err) {
  return err?.response?.data?.error?.details || null;
}

export { unwrap, unwrapFull };
