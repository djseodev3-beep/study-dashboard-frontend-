import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import stockService from '../services/stock.service'
import StockTable from '../components/common/StockTable'

export default function Dashboard() {
  const { user } = useAuth()
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    stockService
      .getAll()
      .then(setStocks)
      .catch(() => setError('Failed to load stocks'))
      .finally(() => setLoading(false))
  }, [])

  const totalMarketCap = stocks.reduce((sum, s) => sum + Number(s.currentPrice || 0), 0)
  const gainers = stocks.filter((s) => s.currentPrice > s.previousClose).length
  const losers = stocks.filter((s) => s.currentPrice < s.previousClose).length

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Welcome back, {user?.username}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Stocks', value: stocks.length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Gainers', value: gainers, color: 'bg-green-50 text-green-700' },
          { label: 'Losers', value: losers, color: 'bg-red-50 text-red-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-5 ${color}`}>
            <p className="text-sm font-medium opacity-70">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
        {loading ? (
          <p className="text-gray-400 py-8 text-center">Loading stocks...</p>
        ) : error ? (
          <p className="text-red-500 py-8 text-center">{error}</p>
        ) : (
          <StockTable stocks={stocks} />
        )}
      </div>
    </div>
  )
}