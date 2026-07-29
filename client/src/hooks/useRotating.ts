import { useEffect, useState } from 'react';

// Rotating index for featured content (quotes, engineers) on an interval.
export function useRotating<T>(items: T[], intervalMs = 8000): T {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [items.length, intervalMs]);
  return items[index] ?? items[0];
}
