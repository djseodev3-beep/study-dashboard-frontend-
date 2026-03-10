import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/portfolio', label: 'Portfolio', icon: '💼' },
]

const adminItems = [
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/stocks', label: 'Manage Stocks', icon: '📈' },
]

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-lg font-bold text-indigo-600">Stock Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">
          {user?.username} · <span className="font-medium">{user?.role}</span>
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end className={linkClass}>
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {isAdmin() && (
          <>
            <div className="pt-4 pb-1 px-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
            </div>
            {adminItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  )
}
