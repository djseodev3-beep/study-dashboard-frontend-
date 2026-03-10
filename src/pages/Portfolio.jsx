import { useEffect, useState } from 'react'
import portfolioService from '../services/portfolio.service'
import stockService from '../services/stock.service'
import PortfolioChart from '../components/charts/PortfolioChart'

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null)
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ stockId: '', quantity: '', avgPrice: '' })
  const [editItem, setEditItem] = useState(null)
  const [error, setError] = useState('')

  const loadData = () =>
    Promise.all([portfolioService.get(), stockService.getAll()]).then(([p, s]) => {
      setPortfolio(p)
      setStocks(s)
    })

  useEffect(() => {
    loadData().finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        stockId: Number(form.stockId),
        quantity: Number(form.quantity),
        avgPrice: Number(form.avgPrice),
      }
      if (editItem) {
        await portfolioService.updateItem(editItem.id, payload)
      } else {
        await portfolioService.addItem(payload)
      }
      setShowForm(false)
      setEditItem(null)
      setForm({ stockId: '', quantity: '', avgPrice: '' })
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item')
    }
  }

  const handleEdit = (item) => {
    setEditItem(item)
    setForm({ stockId: item.stockId, quantity: item.quantity, avgPrice: item.avgPrice })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this item from portfolio?')) return
    await portfolioService.deleteItem(id)
    await loadData()
  }

  if (loading) return <p className="text-gray-400 py-8">Loading portfolio...</p>

  const items = portfolio?.items || []
  const totalValue = portfolio?.totalValue || 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Portfolio</h2>
          <p className="text-gray-500">Total Value: <span className="font-semibold text-indigo-600">${Number(totalValue).toFixed(2)}</span></p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({ stockId: '', quantity: '', avgPrice: '' }) }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          + Add Position
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">{editItem ? 'Edit Position' : 'Add Position'}</h3>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <select
                value={form.stockId}
                onChange={(e) => setForm({ ...form, stockId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              >
                <option value="">Select stock</option>
                {stocks.map((s) => (
                  <option key={s.id} value={s.id}>{s.ticker} - {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number" min="1" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avg Price ($)</label>
              <input
                type="number" step="0.01" min="0.01" value={form.avgPrice}
                onChange={(e) => setForm({ ...form, avgPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div className="col-span-3 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                {editItem ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Holdings</h3>
          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No positions yet. Add your first stock!</p>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase border-b">
                  {['Ticker', 'Qty', 'Avg Price', 'Current', 'Value', 'P&L', ''].map((h) => (
                    <th key={h} className="pb-2 text-left pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="text-sm">
                    <td className="py-3 pr-4 font-mono font-semibold text-indigo-600">{item.ticker}</td>
                    <td className="py-3 pr-4">{item.quantity}</td>
                    <td className="py-3 pr-4">${Number(item.avgPrice).toFixed(2)}</td>
                    <td className="py-3 pr-4">${Number(item.currentPrice).toFixed(2)}</td>
                    <td className="py-3 pr-4 font-medium">${Number(item.totalValue).toFixed(2)}</td>
                    <td className={`py-3 pr-4 font-medium ${item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.profitLoss >= 0 ? '+' : ''}{Number(item.profitLoss).toFixed(2)}
                    </td>
                    <td className="py-3 space-x-2">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Allocation</h3>
          <PortfolioChart items={items} />
        </div>
      </div>
    </div>
  )
}