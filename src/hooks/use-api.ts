import { useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const useApi = <T = unknown>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const request = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios<T>({
        method,
        url,
        data: body,
        ...config,
        withCredentials: true, // Pastikan cookie disertakan
      });
      setData(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error("Unknown error:", error);
        setError("Error occurred. Please try again.");
        throw new Error("Unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data, // Data dari response
    error, // Error message jika terjadi error
    isLoading, // Status loading
    request, // Fungsi untuk memanggil request
  };
};
