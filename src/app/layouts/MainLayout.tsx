import React from 'react';
import { Header } from './header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../../shared/components';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout - Application layout shell composing Sidebar, Header, Content & Toasts
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
