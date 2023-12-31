import { useEffect } from "react";

export function useTitle(titleName: string): void {
  useEffect(() => {
    document.title = titleName;
  }, []);
}