import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// 미인증 접근 시 /login으로 리다이렉트, ADMIN 전용 페이지 접근 시 / 로 리다이렉트
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin()) return <Navigate to="/" replace />

  return children
}
