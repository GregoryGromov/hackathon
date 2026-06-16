'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

export type CountUpOptions = {
  readonly duration?: number;
  readonly easing?: (t: number) => number;
};

const defaultEase = (t: number) => 1 - (1 - t) ** 3;

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduceMotion(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia(REDUCE_MOTION_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReduceMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCE_MOTION_QUERY).matches;
}

export function useCountUp(value: number, options: CountUpOptions = {}): number {
  const { duration = 600, easing = defaultEase } = options;
  const reduceMotion = useSyncExternalStore(subscribeReduceMotion, getReduceMotion, () => false);
  const skipAnimation = reduceMotion || duration <= 0;
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (skipAnimation) {
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = easing(t);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
        frameRef.current = null;
      }
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration, easing, skipAnimation]);

  return skipAnimation ? value : display;
}

export type CountUpProps = {
  readonly value: number;
  readonly duration?: number;
  readonly format?: (n: number) => string;
  readonly className?: string;
};

export function CountUp({ value, duration, format, className }: CountUpProps) {
  const display = useCountUp(value, { duration });
  return (
    <span data-slot="count-up" className={className}>
      {format ? format(display) : display.toFixed(0)}
    </span>
  );
}
