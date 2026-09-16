import { useEffect, useRef } from "react";
import { IDLE_TIMEOUT_MS } from "./session";

const ACTIVITY_EVENTS = [
  "pointerdown",
  "pointermove",
  "keydown",
  "wheel",
  "touchstart",
] as const;

/**
 * Inafuatilia shughuli za mtumiaji (kubonyeza, kusogeza, kuandika).
 * Kama mtumiaji hakufanya kitu kwa muda wa `timeoutMs`, `onIdle` inaitwa
 * (mfumo ukifunga session). Kila shughuli inaanza upya kipima muda.
 */
export function useIdleSession(
  onIdle: () => void,
  onActivity: () => void = () => {},
  timeoutMs: number = IDLE_TIMEOUT_MS,
) {
  // Tunaweka callbacks kwenye ref ili effect isijifanye upya kila render
  // (isingekuwa hivyo, kila render ingeanza upya kipima muda na session
  // usingefunga kamwe).
  const onIdleRef = useRef(onIdle);
  const onActivityRef = useRef(onActivity);

  useEffect(() => {
    onIdleRef.current = onIdle;
    onActivityRef.current = onActivity;
  }, [onIdle, onActivity]);

  useEffect(() => {
    let timer: number | undefined;

    const reset = () => {
      onActivityRef.current();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, reset, { passive: true });
    }
    reset();

    return () => {
      window.clearTimeout(timer);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, reset);
      }
    };
  }, [timeoutMs]);
}
