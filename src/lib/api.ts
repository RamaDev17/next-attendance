import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL,
});

// Generic GET
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  const { data } = await api.get(endpoint, { withCredentials: true });
  return data;
};

// Generic POST
export const createData = async <T, U>(endpoint: string, payload: T): Promise<U> => {
  const { data } = await api.post(endpoint, payload, { withCredentials: true });
  return data;
};

// Generic PUT
export const updateData = async <T, U>(endpoint: string, payload: T): Promise<U> => {
  const { data } = await api.put(endpoint, payload, { withCredentials: true });
  return data;
};

// Generic DELETE
export const deleteData = async <T>(endpoint: string): Promise<T> => {
  const { data } = await api.delete(endpoint, { withCredentials: true });
  return data;
};
