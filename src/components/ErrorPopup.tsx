'use client';

import { useEffect, useState } from 'react';

type ErrorPopupProps = {
  message: string;
};

export default function ErrorPopup({ message }: ErrorPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000); 
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white border border-red-500 text-red-500 px-6 py-3 rounded-lg shadow-lg z-50 animate-slideDownFade">
      {message}
    </div>
  );
}
