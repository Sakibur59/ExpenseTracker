'use client';

import { AuthProvider } from '@/context/AuthContext';

import './globals.css';
import Navbar from '@/Components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Expense Tracker</title>
        <meta name="description" content="Track your expenses easily" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}