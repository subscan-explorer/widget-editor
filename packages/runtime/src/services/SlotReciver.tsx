import React, { useEffect, useState, useRef } from 'react';
import mitt from 'mitt';

export class SlotReceiver {
  fallbacks: Partial<Record<string, React.ReactNode>> = {};
  emitter = mitt<Record<string, React.ReactNode>>();

  constructor() {
    this.emitter.on('*', (slotKey: string, c: React.ReactNode) => {
      this.fallbacks[slotKey] = c;
    });
  }
}

export function initSlotReceiver() {
  return new SlotReceiver();
}

export const Receiver: React.FC<{ slotKey?: string; slotReceiver: SlotReceiver }> = ({
  slotKey = '',
  slotReceiver,
}) => {
  const [, setForce] = useState(0);
  const cRef = useRef<React.ReactNode>(slotReceiver.fallbacks[slotKey] || null);
  useEffect(() => {
    if (!slotKey) {
      return;
    }
    const handler = (c: React.ReactNode) => {
      if (slotReceiver.fallbacks[slotKey]) {
        // release memory
        slotReceiver.fallbacks[slotKey] = null;
      }
      cRef.current = c;
      /**
       * the event emitter fired during render process
       * defer the setState to avoid React warning
       */
      setTimeout(() => {
        setForce(prev => prev + 1);
      }, 0);
    };
    slotReceiver.emitter.on(slotKey, handler);
    return () => {
      slotReceiver.emitter.off(slotKey, handler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotKey]);
  return <>{cRef.current}</>;
};
