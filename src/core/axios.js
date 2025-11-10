"use client";
import axios from "axios";
import { authService } from "@/services/auth.services";

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      const msg = error.response?.data?.message || "";

      if (msg.includes("jwt expired") || msg.includes("invalid") || msg.includes("expired token")) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await authService.refresh(); 
          const newToken =
            res?.data?.accessToken || res?.accessToken || res?.data?.data?.accessToken;

          if (newToken) {
            accessToken = newToken; 
            api.defaults.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (err) {
          processQueue(err, null);
          accessToken = null;
          window.location.href = "/auth/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;
