/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, createData, updateData, deleteData } from "@/lib/api";

// Generic Hook untuk CRUD
export const useCrud = (resource: string) => {
  const queryClient = useQueryClient();

  // GET: Fetch semua data
  // GET: Fetch semua data dengan parameter opsional
  const useFetchAll = (params?: Record<string, any>) =>
    useQuery({
      queryKey: [resource, params], // Query key disesuaikan dengan params
      queryFn: () => {
        const queryString = params
          ? `?${new URLSearchParams(params).toString()}`
          : "";
        return fetchData(`/${resource}${queryString}`);
      },
    });

  // POST: Tambah data baru
  const useCreate = () =>
    useMutation({
      mutationFn: (payload: any) => createData(`/${resource}`, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [resource] }); // Refresh cache setelah create
      },
    });

  // PUT: Update data
  const useUpdate = () =>
    useMutation({
      mutationFn: ({ id, payload }: { id: string | number; payload: any }) =>
        updateData(`/${resource}/${id}`, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [resource] }); // Refresh cache setelah update
      },
    });

  // DELETE: Hapus data
  const useDelete = () =>
    useMutation({
      mutationFn: (id: string | number) => deleteData(`/${resource}/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [resource] }); // Refresh cache setelah delete
      },
    });

  return { useFetchAll, useCreate, useUpdate, useDelete };
};
