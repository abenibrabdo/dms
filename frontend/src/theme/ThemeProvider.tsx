import { ReactNode } from 'react';

import './base.css';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <div className="font-sans text-slate-900">{children}</div>;
};

