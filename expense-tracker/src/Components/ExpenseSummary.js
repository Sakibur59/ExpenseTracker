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
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
];

export default function ExpenseSummary({ summary }) {
  if (!summary) return null;

  const { total, byCategory = [], recent = [] } = summary;

  // Prepare chart data
  const chartData = {
    labels: byCategory.map(item => item._id),
    datasets: [
      {
        data: byCategory.map(item => item.total),
        backgroundColor: COLORS.slice(0, byCategory.length),
        borderWidth: 2,
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
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Total Card */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ${total?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {summary.totalCount || 0} transactions
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Spending by Category</h3>
        {byCategory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No expenses to show</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 max-w-xs">
              <Pie data={chartData} options={chartOptions} />
            </div>
            <div className="w-full md:w-1/2">
              <div className="space-y-3">
                {byCategory.map((item, index) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700">{item._id}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      ${item.total.toFixed(2)}
                      {total > 0 && (
                        <span className="text-gray-500 text-xs ml-1">
                          ({((item.total / total) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {recent && recent.length > 0 && (
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Recent Transactions</h3>
          <div className="space-y-2">
            {recent.map((expense) => (
              <div key={expense._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}