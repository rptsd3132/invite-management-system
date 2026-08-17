import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { getMyTemplates, getTemplates } from "../lib/api";
import type { Template } from "../types";

export function useAllTemplates(): {
  templates: Template[];
  isLoading: boolean;
  isError: boolean;
} {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const publicQuery = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const mineQuery = useQuery({
    queryKey: ["my-templates"],
    queryFn: getMyTemplates,
    enabled: isAuthenticated,
  });

  const templates = useMemo(() => {
    const merged = new Map<string, Template>();
    for (const t of publicQuery.data ?? []) merged.set(t.id, t);
    for (const t of mineQuery.data ?? []) merged.set(t.id, t);
    return [...merged.values()];
  }, [publicQuery.data, mineQuery.data]);

  return {
    templates,
    isLoading: publicQuery.isLoading || mineQuery.isLoading,
    isError: publicQuery.isError || mineQuery.isError,
  };
}