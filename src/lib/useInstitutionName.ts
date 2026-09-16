import { useEffect, useState } from "react";
import { apiGet } from "./api";

const FALLBACK = "ElimuBora";

/**
 * Inapakia jina la taasisi ya kwanza kutoka API na kulitumia kama jina la app.
 * Pia inabadilisha document.title (title ya tab ya browser).
 *
 * @param enabled Kama `false`, inarudisha FALLBACK (ElimuBora) bila kupakia chochote
 *                na bila kubadilisha title — inatumika kwenye landing page.
 */
export function useInstitutionName(enabled = true): string {
  const [name, setName] = useState(FALLBACK);

  useEffect(() => {
    if (!enabled) return;
    apiGet<{ idtaasisi: number; taasisi_name: string }[]>("/api/taasisi")
      .then((institutions) => {
        const first = institutions[0]?.taasisi_name?.trim();
        if (first) {
          setName(first);
          document.title = first;
        }
      })
      .catch(() => {});
  }, [enabled]);

  return name;
}
