// hooks/useRemoteOptions.js
import { useCallback, useRef, useState } from "react";

/**
 * Hook genérico para buscar opções de endpoints quando o usuário abre o select/campo.
 * - Mapeia automaticamente o ID (qualquer chave que termina com "_ID") e o label (por padrão "name").
 * - Cacheia por chave (ex.: "professions", "hobbies"...).
 */
export default function useRemoteOptions() {
  const cacheRef = useRef(new Map());
  const [loadingKey, setLoadingKey] = useState(null);
  const [errorKey, setErrorKey] = useState(null);

  const getIdKey = (obj) => {
    const idKey = Object.keys(obj).find((k) => k.toLowerCase().endsWith("_id"));
    return idKey || "id";
  };

  const toSelectOptions = (arr) => {
    if (!Array.isArray(arr)) return [];
    if (arr.length === 0) return [];
    const idKey = getIdKey(arr[0]);
    return arr.map((item) => ({
      value: item[idKey],
      label: item.name ?? String(item[idKey]),
      raw: item,
    }));
  };

  const fetchOnce = useCallback(async (key, fetcher) => {
    if (cacheRef.current.has(key)) return cacheRef.current.get(key);
    setLoadingKey(key);
    setErrorKey(null);
    try {
      const data = await fetcher();
      const mapped = toSelectOptions(data);
      cacheRef.current.set(key, mapped);
      return mapped;
    } catch (e) {
      setErrorKey(key);
      throw e;
    } finally {
      setLoadingKey(null);
    }
  }, []);

  const getCached = useCallback((key) => cacheRef.current.get(key) || [], []);

  return {
    loadingKey,
    errorKey,
    fetchOnce,
    getCached,
  };
}
