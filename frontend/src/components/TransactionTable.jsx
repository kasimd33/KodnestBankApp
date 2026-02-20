/**
 * Transaction Table - Displays transaction history
 */
const TransactionTable = ({ transactions, onDownloadPDF }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        {onDownloadPDF && (
          <button
            onClick={onDownloadPDF}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Download PDF Statement
          </button>
        )}
      </div>
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b dark:border-gray-600">
            <th className="py-2 pr-4">Date</th>
            <th className="pr-4">Type</th>
            <th className="pr-4">Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.length ? (
            transactions.map((txn, index) => (
              <tr key={index} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-2">
                  {new Date(txn.createdAt || txn.date).toLocaleDateString()}
                </td>
                <td className="capitalize">{txn.type}</td>
                <td
                  className={`font-semibold ${
                    txn.type === "deposit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹ {Number(txn.amount).toLocaleString()}
                </td>
                <td>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-sm">
                    Success
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500">
                No transactions yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
