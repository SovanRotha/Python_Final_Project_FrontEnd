

import { useMemo, useState } from 'react';

const initialExpenses = [
  { id: 1, name: 'Hotel deposit', category: 'Stay', amount: 420 },
  { id: 2, name: 'Dinner', category: 'Food', amount: 68 },
  { id: 3, name: 'Train tickets', category: 'Transport', amount: 95 },
];

const categories = ['Stay', 'Food', 'Transport', 'Activities', 'Other'];
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function Budget() {
  const [budget, setBudget] = useState(2500);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [expenseName, setExpenseName] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');
  const [expenseAmount, setExpenseAmount] = useState('');

  const spent = useMemo(
    () => expenses.reduce((total, expense) => total + expense.amount, 0),
    [expenses],
  );
  const remaining = budget - spent;
  const percentSpent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const categoryTotals = categories
    .map((category) => ({
      name: category,
      amount: expenses
        .filter((expense) => expense.category === category)
        .reduce((total, expense) => total + expense.amount, 0),
    }))
    .filter((category) => category.amount > 0);

  function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(expenseAmount);
    if (!expenseName.trim() || !Number.isFinite(amount) || amount <= 0) return;

    setExpenses((current) => [
      { id: Date.now(), name: expenseName.trim(), category: expenseCategory, amount },
      ...current,
    ]);
    setExpenseName('');
    setExpenseAmount('');
  }

  return (
    <div className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Trip finances
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Budget &amp; wallet</h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep your trip spending in one place and see what you have left.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Budget overview">
          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Trip budget</p>
            <label className="mt-2 flex items-center gap-2">
              <span className="text-xl font-bold">$</span>
              <input
                aria-label="Trip budget in dollars"
                className="w-full border-b border-slate-200 bg-transparent text-2xl font-bold outline-none focus:border-teal-600"
                type="number"
                min="0"
                step="50"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value) || 0)}
              />
            </label>
            <p className="mt-2 text-xs text-slate-400">Tap the amount to update it</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Spent so far</p>
            <p className="mt-2 text-2xl font-bold">{currency.format(spent)}</p>
            <p className="mt-2 text-xs text-slate-400">{expenses.length} recorded expenses</p>
          </article>
          <article className="rounded-2xl bg-teal-800 p-5 text-white shadow-sm">
            <p className="text-sm font-medium text-teal-100">Remaining</p>
            <p className="mt-2 text-2xl font-bold">{currency.format(remaining)}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-teal-300 transition-[width]"
                style={{ width: `${percentSpent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-teal-100">
              {budget > 0 ? Math.round((spent / budget) * 100) : 0}% of budget used
            </p>
          </article>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Recent expenses</h2>
                <p className="text-sm text-slate-500">Your latest trip costs</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {expenses.length} items
              </span>
            </div>
            {expenses.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {expenses.map((expense) => (
                  <li key={expense.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{expense.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{expense.category}</p>
                    </div>
                    <p className="shrink-0 font-bold">{currency.format(expense.amount)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No expenses yet. Add your first trip cost to get started.
              </p>
            )}
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-bold">Add an expense</h2>
              <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-slate-600">
                  Description
                  <input
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    value={expenseName}
                    onChange={(event) => setExpenseName(event.target.value)}
                    placeholder="e.g. Museum tickets"
                    required
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium text-slate-600">
                    Category
                    <select
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                      value={expenseCategory}
                      onChange={(event) => setExpenseCategory(event.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Amount ($)
                    <input
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={expenseAmount}
                      onChange={(event) => setExpenseAmount(event.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </label>
                </div>
                <button
                  className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  type="submit"
                >
                  Add expense
                </button>
              </form>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-bold">Spending by category</h2>
              <ul className="mt-4 space-y-4">
                {categoryTotals.map((category) => (
                  <li key={category.name}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-slate-600">{category.name}</span>
                      <span className="font-semibold">{currency.format(category.amount)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{
                          width: `${spent > 0 ? (category.amount / spent) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
                {categoryTotals.length === 0 && (
                  <li className="text-sm text-slate-500">Categories appear when you add expenses.</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;