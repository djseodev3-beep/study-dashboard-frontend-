// 주식 목록을 테이블로 표시하는 재사용 컴포넌트
export default function StockTable({ stocks, onEdit, onDelete, editable = false }) {
  const formatPrice = (price) =>
    price != null ? `$${Number(price).toFixed(2)}` : '-'

  const getChangePercent = (current, prev) => {
    if (!current || !prev) return null
    return (((current - prev) / prev) * 100).toFixed(2)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {['Ticker', 'Name', 'Current Price', 'Change', 'Sector', ...(editable ? ['Actions'] : [])].map(
              (h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {stocks.length === 0 ? (
            <tr>
              <td colSpan={editable ? 6 : 5} className="px-4 py-8 text-center text-gray-400">
                No stocks available
              </td>
            </tr>
          ) : (
            stocks.map((stock) => {
              const change = getChangePercent(stock.currentPrice, stock.previousClose)
              const isUp = change > 0
              return (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-600">{stock.ticker}</td>
                  <td className="px-4 py-3 text-gray-900">{stock.name}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(stock.currentPrice)}</td>
                  <td className={`px-4 py-3 font-medium ${change == null ? 'text-gray-400' : isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {change != null ? `${isUp ? '+' : ''}${change}%` : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{stock.sector || '-'}</td>
                  {editable && (
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => onEdit(stock)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(stock.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
