import { useEffect, useRef } from "react";
import {
  track,
  type AnalyticsEventName,
  type AnalyticsPayloads,
} from "./analytics.ts";
export function useSectionEvent<E extends AnalyticsEventName>(
  event: E,
  payload: AnalyticsPayloads[E],
) {
  const ref = useRef<HTMLElement>(null);
  const sent = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || sent.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sent.current) {
          sent.current = true;
          track(event, payload);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [event, payload]);
  return ref;
}
