'use client';

import React, { createContext, useContext } from 'react';

import type { PermissionMap } from '@/types/permission';
import { can } from '@/libs/permission';

interface AuthContextValue {
  userId: number;
  permissions: PermissionMap;
  can: (resource: string, abilities: any) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  userId,
  permissions,
  children,
}: {
  userId: number;
  permissions: PermissionMap;
  children: React.ReactNode;
}) {
  const value: AuthContextValue = {
    userId,
    permissions,
    can: (resource, abilities) =>
      can(permissions, resource, abilities),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
