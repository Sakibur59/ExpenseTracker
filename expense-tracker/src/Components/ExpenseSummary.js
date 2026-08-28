'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#FF9F43', '#00B894', '#6C5CE7', '#FD79A8'
];

const icons = {
  'Food & Dining': '🍔',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Bills & Utilities': '💡',
  'Healthcare': '🏥',
  'Education': '📚',
  'Entertainment': '🎬',
  'Travel': '✈️',
  'Insurance': '🛡️',
  'Rent': '🏠',
  'Groceries': '🛒',
  'Other': '📌'
};

export default function ExpenseSummary({ summary }) {
  if (!summary) return null;

  const { total, byCategory = [], recent = [] } = summary;

  // Calculate current month total
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const currentMonthTotal = recent
    .filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const chartData = {
    labels: byCategory.map(item => item._id),
    datasets: [
      {
        data: byCategory.map(item => item.total),
        backgroundColor: COLORS.slice(0, byCategory.length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `৳${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Total Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Expenses</p>
            <p className="text-4xl font-bold mt-2">
              ৳{total?.toFixed(2) || '0.00'}
            </p>
            <p className="text-blue-200 text-sm mt-2">
              {summary.totalCount || 0} transactions
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
            <span className="text-4xl">💰</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">This Month</span>
            <span className="font-semibold">৳{currentMonthTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span> Spending by Category
        </h3>
        {byCategory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-3">📭</p>
            <p>No expenses to show</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 max-w-xs">
              <Pie data={chartData} options={chartOptions} />
            </div>
            <div className="w-full md:w-1/2">
              <div className="space-y-3">
                {byCategory.slice(0, 6).map((item, index) => (
                  <div key={item._id} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {icons[item._id] || '📌'} {item._id}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        ৳{item.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.total / total) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {recent && recent.length > 0 && (
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <span className="text-xl">🔄</span> Recent Transactions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recent.map((expense, index) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                    {expense.category.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {expense.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {expense.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">৳{expense.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}