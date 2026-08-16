'use client';

import { useState, useEffect, useCallback } from 'react';

import ExpenseSummary from '@/components/ExpenseSummary';
import { expenseService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/Components/ProtectedRoute';
import ExpenseForm from '@/Components/ExpenseForm';
import ExpenseList from '@/Components/ExpenseList';

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's your expense overview
              </p>
            </div>
            <button
              onClick={() => {
                setEditingExpense(null);
                setShowForm(!showForm);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {showForm ? '✕ Cancel' : '➕ Add Expense'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          {summary && !loading && (
            <div className="mb-8">
              <ExpenseSummary summary={summary} />
            </div>
          )}

          {/* Expense Form */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">
                {editingExpense ? '✏️ Edit Expense' : '📝 Add New Expense'}
              </h2>
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

          {/* Expense List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📋 Recent Expenses</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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