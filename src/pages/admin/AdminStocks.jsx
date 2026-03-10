import { useEffect, useState } from 'react'
import stockService from '../../services/stock.service'
import StockTable from '../../components/common/StockTable'

const emptyForm = { ticker: '', name: '', currentPrice: '', previousClose: '', sector: '' }

export default function AdminStocks() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const loadStocks = () => stockService.getAll().then(setStocks)

  useEffect(() => {
    loadStocks().finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        currentPrice: Number(form.currentPrice),
        previousClose: Number(form.previousClose),
      }
      if (editId) {
        await stockService.update(editId, payload)
      } else {
        await stockService.create(payload)
      }
      setShowForm(false)
      setEditId(null)
      setForm(emptyForm)
      await loadStocks()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save stock')
    }
  }

  const handleEdit = (stock) => {
    setEditId(stock.id)
    setForm({
      ticker: stock.ticker,
      name: stock.name,
      currentPrice: stock.currentPrice,
      previousClose: stock.previousClose,
      sector: stock.sector || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this stock?')) return
    await stockService.delete(id)
    await loadStocks()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
          <p className="text-gray-500">Add and manage stock data</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm) }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          + Add Stock
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">{editId ? 'Edit Stock' : 'Add Stock'}</h3>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            {[
              { key: 'ticker', label: 'Ticker', placeholder: 'AAPL', disabled: !!editId },
              { key: 'name', label: 'Company Name', placeholder: 'Apple Inc.' },
              { key: 'sector', label: 'Sector', placeholder: 'Technology' },
              { key: 'currentPrice', label: 'Current Price', placeholder: '150.00', type: 'number' },
              { key: 'previousClose', label: 'Previous Close', placeholder: '148.00', type: 'number' },
            ].map(({ key, label, placeholder, type = 'text', disabled = false }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  step={type === 'number' ? '0.01' : undefined}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
                  placeholder={placeholder}
                  disabled={disabled}
                  required={key !== 'sector'}
                />
              </div>
            ))}
            <div className="col-span-3 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                {editId ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading...</p>
        ) : (
          <StockTable stocks={stocks} editable onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}