import { useSearchParams, useRouter } from "next/navigation";

export function useSearchParam(key: string): [searchParam: string | null, setSearchParam: (newValue: string) => void] {
  const nextSearchParams = useSearchParams()
  const searchParam = nextSearchParams.get(key);
  const { push } = useRouter();

  const setSearchParam = (newValue: string) => {
    const old = new URLSearchParams(window.location.search);
    old.set(key, newValue);

    push(`${window.location.pathname}?${old.toString()}`);
  };

  return [searchParam, setSearchParam];
}
