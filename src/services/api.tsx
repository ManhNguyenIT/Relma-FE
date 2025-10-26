// apiClient.ts
import axios, { AxiosError, AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response) {
          console.error('API Error:', error.response);
        } else {
          console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  private toQueryString(obj?: object): string {
    if (!obj || typeof obj !== 'object') return '';
    return Object.entries(obj)
      .flatMap(([k, v]) =>
        Array.isArray(v)
          ? v
              .filter((x) => x != null)
              .map((x) => `${encodeURIComponent(k)}=${encodeURIComponent(x)}`)
          : v != null
            ? [`${encodeURIComponent(k)}=${encodeURIComponent(v)}`]
            : [],
      )
      .join('&');
  }

  public async get<T>(url: string, params?: object): Promise<T> {
    const query = this.toQueryString(params);
    return this.client.get(`${url}?${query}`);
  }

  public async post<T>(url: string, data?: object): Promise<T> {
    if (data instanceof FormData) {
      return this.client.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return this.client.post(url, data);
  }

  public async put<T>(url: string, data?: object): Promise<T> {
    return this.client.put(url, data);
  }

  public async delete<T>(url: string, params?: object): Promise<T> {
    const query = this.toQueryString(params);
    return this.client.delete(`${url}?${query}`);
  }
}

// Export instance với baseURL
export const client = new ApiClient(import.meta.env.VITE_APP_API_URL || 'http://localhost:5000');
