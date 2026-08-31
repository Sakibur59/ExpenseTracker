'use client';

import { useState } from 'react';
import { format } from 'date-fns';

const categoryColors = {
  'Food & Dining': 'bg-rose-100 text-rose-700',
  'Transportation': 'bg-amber-100 text-amber-700',
  'Shopping': 'bg-purple-100 text-purple-700',
  'Bills & Utilities': 'bg-blue-100 text-blue-700',
  'Healthcare': 'bg-emerald-100 text-emerald-700',
  'Education': 'bg-indigo-100 text-indigo-700',
  'Entertainment': 'bg-pink-100 text-pink-700',
  'Travel': 'bg-cyan-100 text-cyan-700',
  'Insurance': 'bg-slate-100 text-slate-700',
  'Rent': 'bg-orange-100 text-orange-700',
  'Groceries': 'bg-lime-100 text-lime-700',
  'Other': 'bg-gray-100 text-gray-700'
};

export default function ExpenseList({ expenses, onDelete, onEdit, onBulkDelete }) {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  const categories = [...new Set(expenses.map(exp => exp.category))];

  const filteredExpenses = expenses
    .filter((expense) => {
      if (!filter) return true;
      return expense.category === filter || 
             expense.description.toLowerCase().includes(filter.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedExpenses(filteredExpenses.map(exp => exp._id));
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleSelectExpense = (id) => {
    setSelectedExpenses(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedExpenses.length === 0) {
      alert('Please select expenses to delete');
      return;
    }
    onBulkDelete(selectedExpenses);
    setSelectedExpenses([]);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search expenses..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 transition-colors"
          >
            {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {selectedExpenses.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg shadow-red-500/30 transition-all duration-300"
            >
              🗑️ Delete ({selectedExpenses.length})
            </button>
          )}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/30">
            <span className="text-sm opacity-80">Total:</span>
            <span className="font-bold ml-2">৳{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-xl font-medium text-gray-600">No expenses found</p>
          <p className="text-sm text-gray-400 mt-1">Start tracking your expenses by adding one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-sm font-semibold text-gray-600">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={selectedExpenses.length === filteredExpenses.length && filteredExpenses.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2 text-center">Category</div>
            <div className="col-span-2 text-center">Date</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Expense Items */}
          {filteredExpenses.map((expense) => (
            <div
              key={expense._id}
              className={`grid grid-cols-12 gap-3 items-center px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
                selectedExpenses.includes(expense._id) 
                  ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                  : 'hover:bg-gray-50/50'
              }`}
            >
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedExpenses.includes(expense._id)}
                  onChange={() => handleSelectExpense(expense._id)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              <div className="col-span-4">
                <div className="font-medium text-gray-900">{expense.description}</div>
              </div>
              <div className="col-span-2 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category] || 'bg-gray-100 text-gray-700'}`}>
                  {expense.category}
                </span>
              </div>
              <div className="col-span-2 text-center text-sm text-gray-600">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </div>
              <div className="col-span-1 text-right font-bold text-gray-900">
                ৳{expense.amount.toFixed(2)}
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(expense._id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}