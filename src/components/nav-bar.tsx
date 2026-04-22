'use client';

export function NavBar({ children, activeTab }: { children: React.ReactNode; activeTab: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
