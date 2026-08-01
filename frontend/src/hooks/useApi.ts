import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import api from "../lib/api";
import type { AxiosError } from "axios";

export function useApiQuery<TData>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<TData, AxiosError>, "queryKey" | "queryFn">,
) {
  return useQuery<TData, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<TData>(url);
      return data;
    },
    ...options,
  });
}

export function useApiMutation<TData, TVariables>(
  url: string,
  method: "post" | "put" | "delete" | "patch" = "post",
  options?: Omit<UseMutationOptions<TData, AxiosError, TVariables>, "mutationFn">,
) {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await api[method]<TData>(url, variables);
      return data;
    },
    ...options,
  });
}
