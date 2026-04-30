"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={loginWithGoogle}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}