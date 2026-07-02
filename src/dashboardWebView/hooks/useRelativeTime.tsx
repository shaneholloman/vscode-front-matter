import { useState, useEffect } from 'react';

/**
 * Returns a human-readable relative time string (e.g. "2m ago", "just now")
 * that updates every 30 seconds.
 */
export function useRelativeTime(timestamp: number | null): string {
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    if (timestamp === null) {
      setLabel('');
      return;
    }

    const compute = () => {
      const diff = Math.floor((Date.now() - timestamp) / 1000);
      if (diff < 10) {
        setLabel('just now');
      } else if (diff < 60) {
        setLabel(`${diff}s ago`);
      } else if (diff < 3600) {
        setLabel(`${Math.floor(diff / 60)}m ago`);
      } else if (diff < 86400) {
        setLabel(`${Math.floor(diff / 3600)}h ago`);
      } else {
        setLabel(`${Math.floor(diff / 86400)}d ago`);
      }
    };

    compute();
    const id = setInterval(compute, 30_000);
    return () => clearInterval(id);
  }, [timestamp]);

  return label;
}
