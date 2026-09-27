"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchElders } from "@/lib/silvercare/ui";

export interface SelectedElder {
  id: string;
  name: string;
  birthDate: string;
  careLevel: string;
  livingStatus: string | null;
}

/** 从 ?elder= 选择老人，默认第一个 */
export function useSelectedElder() {
  const params = useSearchParams();
  const [elders, setElders] = useState<SelectedElder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchElders()
      .then(setElders)
      .catch(() => setError("加载老人列表失败"))
      .finally(() => setLoading(false));
  }, []);

  const selectedId = params.get("elder");
  const elder = selectedId ? elders.find((e) => e.id === selectedId) : elders[0];

  return { elders, elder, elderId: elder?.id, loading, error, selectedId };
}
