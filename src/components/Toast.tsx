import React, { useEffect } from 'react';
import { Toast as VibeToast } from '@vibe/core';
import type { ToastType } from '@vibe/core';

interface ToastProps {
  message: string;
  type?: ToastType;
  autoHideDuration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'positive',
  autoHideDuration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [autoHideDuration, onClose]);

  return (
    <div className="fixed right-4 top-4 z-[9999]">
      <VibeToast open type={type} className="!min-w-[200px]">
        {message}
      </VibeToast>
    </div>
  );
};

export default Toast;
