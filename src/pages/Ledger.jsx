import { useState } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, ScanLine, AlertCircle, CheckCircle2, FileCheck2 } from 'lucide-react';
import { format } from 'date-fns';

const initialLedger = [
  { id: '1', type: 'income', category: 'Client Payment', amount: 50000, date: new Date().toISOString(), desc: 'Payment for shipment #1024' },
  { id: '2', type: 'expense', category: 'Fuel', amount: 12000, date: new Date(Date.now() - 86400000).toISOString(), desc: 'Diesel refill Alpha Truck' },
];

const mockRecurringExpenses = [
  { id: 'r1', category: 'Maintenance', amount: 15000, desc: 'Monthly Garage Rent' },
  { id: 'r2', category: 'Other Expense', amount: 8000, desc: 'Fleet Insurance Premium' }
];

export default function Ledger() {
  const [ledger, setLedger] = useState(initialLedger);
  const [pendingRecurring, setPendingRecurring] = useState(mockRecurringExpenses);
  const [isScanning, setIsScanning] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'income',
    category: 'Client Payment',
    amount: '',
    desc: ''
  });

  const incomeCategories = ['Client Payment', 'Refund', 'Other Income'];
  const expenseCategories = ['Fuel', 'Maintenance', 'Tolls', 'Salaries', 'Other Expense'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) return;
    
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      amount: Number(formData.amount),
      date: new Date().toISOString()
    };
    
    setLedger([newEntry, ...ledger]);
    setFormData({ type: 'income', category: 'Client Payment', amount: '', desc: '' });
  };

  const handleDelete = (id) => {
    setLedger(ledger.filter(item => item.id !== id));
  };

  const handleApproveRecurring = () => {
    const newEntries = pendingRecurring.map(req => ({
      id: Math.random().toString(36).substr(2, 9),
      type: 'expense',
      category: req.category,
      amount: req.amount,
      desc: req.desc + ' (Auto-Drafted)',
      date: new Date().toISOString()
    }));
    
    setLedger([...newEntries, ...ledger]);
    setPendingRecurring([]); // Clear them out
  };

  const handleScanReceipt = () => {
    setIsScanning(true);
    // Simulate OCR delay
    setTimeout(() => {
      setFormData({
        type: 'expense',
        category: 'Fuel',
        amount: '3450',
        desc: 'Petron receipt scanned via OCR'
      });
      setIsScanning(false);
    }, 2000);
  };

  const totalIncome = ledger.filter(i => i.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = ledger.filter(i => i.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 h-full pb-10">
      
      {/* Recurring Expense Alert Banner */}
      {pendingRecurring.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-amber-800">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <div>
              <p className="font-semibold">Action Required: {pendingRecurring.length} Pending Recurring Expenses</p>
              <p className="text-sm opacity-80">Your fixed monthly costs (e.g. Garage Rent, Insurance) are due to be logged.</p>
            </div>
          </div>
          <button 
            onClick={handleApproveRecurring}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            Approve & Draft All
          </button>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cash Flow Ledger</h1>
          <p className="text-slate-500">Track your incoming payments and outgoing expenses.</p>
        </div>
        
        {/* Summary Cards */}
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-sm text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Balance</p>
            <p className={`text-xl font-bold font-mono ${balance >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
              ₱{balance.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 px-6 py-3 rounded-xl shadow-sm text-center">
            <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-1">Income</p>
            <p className="text-xl font-bold font-mono text-green-700">₱{totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 border border-red-100 px-6 py-3 rounded-xl shadow-sm text-center">
            <p className="text-xs text-red-600 uppercase tracking-wider font-semibold mb-1">Expense</p>
            <p className="text-xl font-bold font-mono text-red-700">₱{totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Add Entry Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              New Transaction
            </h2>
            <button 
              onClick={handleScanReceipt}
              disabled={isScanning}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md font-medium transition-all ${
                isScanning ? 'bg-blue-50 text-blue-400 cursor-wait' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isScanning ? (
                <span className="animate-pulse flex items-center gap-1.5"><ScanLine className="w-4 h-4" /> Scanning...</span>
              ) : (
                <><ScanLine className="w-4 h-4" /> Scan Receipt OCR</>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income', category: incomeCategories[0] })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                    formData.type === 'income' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense', category: expenseCategories[0] })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                    formData.type === 'expense' 
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">₱</span>
                <input 
                  type="number" 
                  min="0"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-2 outline-none focus:border-blue-500 transition-colors"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors resize-none h-20"
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Optional notes..."
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Save Transaction
            </button>
          </form>
        </div>

        {/* Ledger Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledger.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {format(new Date(entry.date), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {entry.type === 'income' 
                          ? <ArrowUpRight className="w-4 h-4 text-green-500" />
                          : <ArrowDownRight className="w-4 h-4 text-red-500" />
                        }
                        <span className="font-medium text-slate-800">{entry.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[200px]">
                      {entry.desc || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-mono font-medium ${entry.type === 'income' ? 'text-green-600' : 'text-slate-800'}`}>
                      {entry.type === 'income' ? '+' : '-'} ₱{entry.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-slate-400 group-hover:text-red-500 transition-colors">
                      <button onClick={() => handleDelete(entry.id)} className="hover:bg-red-50 p-2 rounded-md" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {ledger.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
