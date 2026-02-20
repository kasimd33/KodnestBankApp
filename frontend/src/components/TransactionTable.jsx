/**
 * Transaction Table - Displays transaction history
 */
const TransactionTable = ({ transactions, onDownloadPDF }) => {
  return (
    <div className="bg-card border border-border shadow-lg rounded-xl p-6 mt-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-foreground font-archivo">Transaction History</h2>
        {onDownloadPDF && (
          <button
            onClick={onDownloadPDF}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Download PDF Statement
          </button>
        )}
      </div>
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 pr-4 text-foreground">Date</th>
            <th className="pr-4 text-foreground">Type</th>
            <th className="pr-4 text-foreground">Amount</th>
            <th className="text-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.length ? (
            transactions.map((txn, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/50">
                <td className="py-2 text-foreground">
                  {new Date(txn.createdAt || txn.date).toLocaleDateString()}
                </td>
                <td className="capitalize text-foreground">{txn.type}</td>
                <td
                  className={`font-semibold ${
                    txn.type === "deposit" ? "text-[var(--chart-3)]" : "text-destructive"
                  }`}
                >
                  ₹ {Number(txn.amount).toLocaleString()}
                </td>
                <td>
                  <span className="bg-[var(--chart-3)]/20 text-[var(--chart-3)] px-2 py-1 rounded-full text-sm">
                    Success
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center text-muted-foreground">
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
