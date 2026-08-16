'use client';

import { useState } from 'react';
import { format } from 'date-fns';

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
    if (selectedExpenses.length === 0) return;
    if (window.confirm(`Delete ${selectedExpenses.length} selected expenses?`)) {
      onBulkDelete(selectedExpenses);
      setSelectedExpenses([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search expenses..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {selectedExpenses.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Selected ({selectedExpenses.length})
            </button>
          )}
          <div className="font-semibold text-lg">
            Total: ${totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-lg">No expenses found</p>
          <p className="text-sm">Start tracking your expenses by adding one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedExpenses.length === filteredExpenses.length && filteredExpenses.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="flex-1 font-semibold text-sm">Description</span>
            <span className="w-32 font-semibold text-sm text-center">Category</span>
            <span className="w-32 font-semibold text-sm text-center">Date</span>
            <span className="w-24 font-semibold text-sm text-right">Amount</span>
            <span className="w-24 text-right">Actions</span>
          </div>

          {/* Expense Items */}
          {filteredExpenses.map((expense) => (
            <div
              key={expense._id}
              className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                selectedExpenses.includes(expense._id) ? 'bg-blue-50 border-2 border-blue-200' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selectedExpenses.includes(expense._id)}
                onChange={() => handleSelectExpense(expense._id)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{expense.description}</div>
              </div>
              <span className="w-32 text-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {expense.category}
                </span>
              </span>
              <span className="w-32 text-center text-sm text-gray-600">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </span>
              <span className="w-24 text-right font-semibold text-gray-900">
                ${expense.amount.toFixed(2)}
              </span>
              <div className="w-24 flex justify-end gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this expense?')) {
                      onDelete(expense._id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}