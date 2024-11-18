import { useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const useApi = () => {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const request = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios({
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
        console.log(error);
        setIsLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error("Unknown error:", error);
        setError("Error occurred. Please try again.");
        setIsLoading(false);
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
