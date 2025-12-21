import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const role = localStorage.getItem('role');

  if (role === 'pm') {
    return <>{children}</>;
  }

  alert("Bạn không có quyền truy cập trang quản lý!");
  return <Navigate to="/" replace />;
}