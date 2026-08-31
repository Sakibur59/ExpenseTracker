'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/Components/ProtectedRoute';
import ExpenseForm from '@/Components/ExpenseForm';
import ExpenseList from '@/Components/ExpenseList';
import ExpenseSummary from '@/Components/ExpenseSummary';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import toast from 'react-hot-toast';
import { expenseService } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItems, setDeleteItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteType, setDeleteType] = useState('single');

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
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Create Expense
  const handleCreateExpense = async (data) => {
    try {
      await expenseService.create(data);
      await loadData();
      setIsModalOpen(false);
      toast.success('Expense added successfully! 🎉');
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense');
    }
  };

  // Handle Update Expense
  const handleUpdateExpense = async (data) => {
    try {
      await expenseService.update(editingExpense._id, data);
      await loadData();
      setEditingExpense(null);
      setIsModalOpen(false);
      toast.success('Expense updated successfully! ✏️');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  };

  // Handle Delete (Open Modal)
  const handleDeleteClick = (id) => {
    setDeleteType('single');
    setDeleteItemId(id);
    setDeleteItems([]);
    setDeleteModalOpen(true);
  };

  // Handle Bulk Delete (Open Modal)
  const handleBulkDeleteClick = (ids) => {
    if (ids.length === 0) {
      toast.error('Please select expenses to delete');
      return;
    }
    setDeleteType('bulk');
    setDeleteItems(ids);
    setDeleteItemId(null);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteType === 'single') {
        await expenseService.delete(deleteItemId);
        toast.success('Expense deleted successfully! 🗑️');
      } else {
        await expenseService.bulkDelete(deleteItems);
        toast.success(`${deleteItems.length} expenses deleted successfully! 🗑️`);
      }
      await loadData();
      setDeleteModalOpen(false);
      setDeleteItemId(null);
      setDeleteItems([]);
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
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
                onClick={handleAddExpense}
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-white/30"
              >
                ➕ Add Expense
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

          {/* Summary */}
          {summary && !loading && (
            <div className="mb-8">
              <ExpenseSummary summary={summary} />
            </div>
          )}

          {/* Expense List */}
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
                onDelete={handleDeleteClick}
                onEdit={handleEditExpense}
                onBulkDelete={handleBulkDeleteClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={isModalOpen}
        onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
        initialData={editingExpense || {}}
        isEdit={!!editingExpense}
        onCancel={handleCloseModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteItemId(null);
          setDeleteItems([]);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={deleteType === 'single' ? 'Delete Expense' : 'Delete Multiple Expenses'}
        message={deleteType === 'single' 
          ? 'Are you sure you want to delete this expense? This action cannot be undone.'
          : `Are you sure you want to delete ${deleteItems.length} expenses? This action cannot be undone.`
        }
        itemCount={deleteType === 'single' ? 1 : deleteItems.length}
      />
    </ProtectedRoute>
  );
}