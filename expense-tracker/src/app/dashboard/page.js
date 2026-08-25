'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/Components/ProtectedRoute';
import ExpenseForm from '@/Components/ExpenseForm';
import ExpenseList from '@/Components/ExpenseList';
import { expenseService } from '../services/api';
import ExpenseSummary from '@/Components/ExpenseSummary';

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        expenseService.getAll({ limit: 100 }),
        expenseService.getSummary()
      ]);
      setExpenses(expensesRes.data.data || []);
      setSummary(summaryRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateExpense = async (data) => {
    try {
      await expenseService.create(data);
      await loadData();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to create expense');
    }
  };

  const handleUpdateExpense = async (data) => {
    try {
      await expenseService.update(editingExpense._id, data);
      await loadData();
      setEditingExpense(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      await expenseService.bulkDelete(ids);
      await loadData();
    } catch (error) {
      console.error('Error bulk deleting expenses:', error);
      alert('Failed to delete expenses');
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-blue-100 mt-1">
                  Here's your expense overview
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setShowForm(!showForm);
                }}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  showForm 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-white/30'
                }`}
              >
                {showForm ? '✕ Cancel' : '➕ Add Expense'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-md">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                {error}
              </div>
            </div>
          )}

          {/* Summary Cards */}
          {summary && !loading && (
            <div className="mb-8">
              <ExpenseSummary summary={summary} />
            </div>
          )}

          {/* Expense Form with Glass Effect */}
          {showForm && (
            <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8 border border-white/30">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{editingExpense ? '✏️' : '📝'}</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </h2>
              </div>
              <ExpenseForm
                onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
                initialData={editingExpense || {}}
                isEdit={!!editingExpense}
                onCancel={() => {
                  setEditingExpense(null);
                  setShowForm(false);
                }}
              />
            </div>
          )}

          {/* Expense List with Glass Effect */}
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/30">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📋</span>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Recent Expenses
              </h2>
              <span className="ml-auto bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {expenses.length} Total
              </span>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-blue-600">Loading</span>
                  </div>
                </div>
              </div>
            ) : (
              <ExpenseList
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onEdit={handleEditExpense}
                onBulkDelete={handleBulkDelete}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}