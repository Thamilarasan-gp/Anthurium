import type { Metadata } from 'next';
import './globals.css';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { AdminShell } from '../components/AdminShell';

export const metadata: Metadata = {
  title: 'ANTHURIUM — Admin Management Console',
  description: 'Independent Administrative Control Portal for ANTHURIUM Boutique',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0F172A] text-slate-100 min-h-screen">
        <AdminAuthProvider>
          <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
