import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "../../services/api/httpClient.js";
import budgetApi from "../../services/api/budgetapi.js";
import budgetCategoryApi from "../../services/api/budget_category_api.js";
import expenseApi from "../../services/api/expense_api.js";
import tripApi from "../../services/api/tripapi.js";
import tripWalletApi from "../../services/api/trip_wallet_api.js";
import walletApi from "../../services/api/walletapi.js";
import walletTransactionApi from "../../services/api/wallet_transaction_api.js";

const today = () => new Date().toISOString().slice(0, 10);
function formatMoney(value, currencyCode = "USD") {
  const currency = /^[A-Z]{3}$/.test(currencyCode) ? currencyCode : "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}

function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

function Budget() {
  const [trips, setTrips] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [tripWallets, setTripWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState("");
  const selectedTripIdRef = useRef(selectedTripId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryAllocation, setCategoryAllocation] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(today);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [fundAmount, setFundAmount] = useState("");
  const [personalWalletName, setPersonalWalletName] = useState("");
  const [personalWalletCurrency, setPersonalWalletCurrency] = useState("USD");

  const loadData = useCallback(async () => {
    try {
      const [
        tripsData,
        budgetsData,
        categoriesData,
        expensesData,
        tripWalletsData,
        transactionsData,
        walletsData,
        user,
      ] = await Promise.all([
        tripApi.list(),
        budgetApi.list(),
        budgetCategoryApi.list(),
        expenseApi.list(),
        tripWalletApi.list(),
        walletTransactionApi.list(),
        walletApi.fetchWalletData(),
        apiRequest("/users/me"),
      ]);

      setError("");
      setTrips(tripsData);
      setBudgets(budgetsData);
      setCategories(categoriesData);
      setExpenses(expensesData);
      setTripWallets(tripWalletsData);
      setTransactions(transactionsData);
      setWallets(walletsData);
      setUserId(user.id);
      const selectedTrip =
        tripsData.find(
          (trip) => String(trip.id) === String(selectedTripIdRef.current),
        ) || tripsData[0];
      const tripId = selectedTrip ? String(selectedTrip.id) : "";
      const tripBudget = budgetsData.find(
        (item) => String(item.trip_id) === tripId,
      );
      const tripCategories = categoriesData.filter(
        (item) => String(item.budget_id) === String(tripBudget?.id),
      );
      selectedTripIdRef.current = tripId;
      setSelectedTripId(tripId);
      setBudgetInput(
        String(tripBudget?.total_budget ?? selectedTrip?.budget_amount ?? ""),
      );
      setExpenseCategoryId(
        tripCategories.length ? String(tripCategories[0].id) : "",
      );
      setEditingExpenseId(null);
    } catch (loadError) {
      console.error("Failed to load budget and wallet data:", loadError);
      setError(getErrorMessage(loadError, "Could not load budget data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedTrip = trips.find(
    (trip) => String(trip.id) === String(selectedTripId),
  );
  const activeBudget = budgets.find(
    (item) => String(item.trip_id) === String(selectedTripId),
  );
  const activeCategories = categories.filter(
    (item) => String(item.budget_id) === String(activeBudget?.id),
  );
  const activeExpenses = expenses
    .filter((item) => String(item.trip_id) === String(selectedTripId))
    .sort((left, right) =>
      String(right.expense_date).localeCompare(String(left.expense_date)),
    );
  const activeTripWallet = tripWallets.find(
    (item) => String(item.trip_id) === String(selectedTripId),
  );
  const activeTransactions = transactions
    .filter((item) => String(item.wallet_id) === String(activeTripWallet?.id))
    .sort((left, right) =>
      String(right.transaction_date).localeCompare(String(left.transaction_date)),
    );

  const totalSpent = useMemo(
    () =>
      activeExpenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0,
      ),
    [activeExpenses],
  );
  const totalBudget = Number(
    activeBudget?.total_budget ?? selectedTrip?.budget_amount ?? budgetInput ?? 0,
  );
  const remaining = totalBudget - totalSpent;
  const spentPercent =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const activeCurrency = activeBudget?.currency || selectedTrip?.currency || "USD";
  const categoryTotals = activeCategories.map((category) => {
    const spent = activeExpenses
      .filter(
        (expense) =>
          String(expense.budget_category_id) === String(category.id),
      )
      .reduce((total, expense) => total + Number(expense.amount || 0), 0);
    return { ...category, spent };
  });

  function resetExpenseForm() {
    setExpenseName("");
    setExpenseAmount("");
    setExpenseDate(today());
    setPaymentMethod("Cash");
    setEditingExpenseId(null);
    setExpenseCategoryId(
      activeCategories.length ? String(activeCategories[0].id) : "",
    );
  }

  function selectTrip(tripId) {
    selectedTripIdRef.current = tripId;
    setSelectedTripId(tripId);
    const trip = trips.find((item) => String(item.id) === String(tripId));
    const tripBudget = budgets.find(
      (item) => String(item.trip_id) === String(tripId),
    );
    const tripCategories = categories.filter(
      (item) => String(item.budget_id) === String(tripBudget?.id),
    );
    setBudgetInput(
      String(tripBudget?.total_budget ?? trip?.budget_amount ?? ""),
    );
    resetExpenseForm();
    setExpenseCategoryId(
      tripCategories.length ? String(tripCategories[0].id) : "",
    );
  }

  async function saveBudget(event) {
    event.preventDefault();
    if (!selectedTrip) return;
    const amount = Number(budgetInput);
    if (!Number.isFinite(amount) || amount < 0) {
      setError("Enter a valid budget amount.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const savedBudget = activeBudget
        ? await budgetApi.update(activeBudget.id, {
            total_budget: amount,
            currency: activeBudget.currency || selectedTrip.currency,
          })
        : await budgetApi.create({
            trip_id: selectedTrip.id,
            total_budget: amount,
            currency: selectedTrip.currency || "USD",
          });
      setBudgets((current) => [
        ...current.filter((item) => item.id !== savedBudget.id),
        savedBudget,
      ]);

      if (activeTripWallet) {
        const updatedWallet = await tripWalletApi.update(activeTripWallet.id, {
          target_amount: amount,
        });
        setTripWallets((current) =>
          current.map((item) =>
            item.id === updatedWallet.id ? updatedWallet : item,
          ),
        );
      }
      setNotice("Trip budget saved.");
    } catch (saveError) {
      console.error("Could not save trip budget:", saveError);
      setError(getErrorMessage(saveError, "Could not save trip budget."));
    } finally {
      setBusy(false);
    }
  }

  async function addCategory(event) {
    event.preventDefault();
    if (!activeBudget) {
      setError("Save a budget for this trip before adding categories.");
      return;
    }
    const allocation = Number(categoryAllocation);
    if (!categoryName.trim() || !Number.isFinite(allocation) || allocation < 0) {
      setError("Enter a category name and a valid allocation.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const category = await budgetCategoryApi.create({
        budget_id: activeBudget.id,
        name: categoryName.trim(),
        allocated_amount: allocation,
      });
      setCategories((current) => [...current, category]);
      setExpenseCategoryId(String(category.id));
      setCategoryName("");
      setCategoryAllocation("");
      setNotice("Budget category added.");
    } catch (createError) {
      console.error("Could not add budget category:", createError);
      setError(getErrorMessage(createError, "Could not add category."));
    } finally {
      setBusy(false);
    }
  }

  async function ensureTripWallet() {
    if (activeTripWallet) return activeTripWallet;
    const createdWallet = await tripWalletApi.create({
      trip_id: selectedTrip.id,
      target_amount: totalBudget,
      current_amount: 0,
      currency: activeCurrency,
    });
    setTripWallets((current) => [...current, createdWallet]);
    return createdWallet;
  }

  async function addTripFunds(event) {
    event.preventDefault();
    const amount = Number(fundAmount);
    if (!userId || !selectedTrip || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount to add to the trip wallet.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const tripWallet = await ensureTripWallet();
      await walletTransactionApi.create({
        wallet_id: tripWallet.id,
        user_id: userId,
        type: "deposit",
        amount,
        source: "Trip wallet funding",
        description: "Funds added to trip wallet",
        transaction_date: today(),
      });
      setFundAmount("");
      await loadData();
      setNotice("Funds added to the trip wallet.");
    } catch (fundError) {
      console.error("Could not add trip wallet funds:", fundError);
      setError(getErrorMessage(fundError, "Could not add wallet funds."));
    } finally {
      setBusy(false);
    }
  }

  async function saveExpense(event) {
    event.preventDefault();
    if (!selectedTrip || !activeBudget) {
      setError("Create a budget for this trip before recording expenses.");
      return;
    }
    if (!activeTripWallet) {
      setError("Create a trip wallet and add funds before recording expenses.");
      return;
    }
    const amount = Number(expenseAmount);
    if (
      !expenseName.trim() ||
      !expenseCategoryId ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError("Complete all required expense fields.");
      return;
    }
    const existingExpense = activeExpenses.find(
      (expense) => String(expense.id) === String(editingExpenseId),
    );
    const linkedTransaction = transactions.find(
      (transaction) => transaction.source === `expense:${editingExpenseId}`,
    );
    const availableBalance =
      Number(activeTripWallet.current_amount || 0) +
      (linkedTransaction ? Number(linkedTransaction.amount || 0) : 0);
    if (!linkedTransaction && amount > Number(activeTripWallet.current_amount || 0)) {
      setError("Insufficient trip wallet funds. Add funds before this expense.");
      return;
    }
    if (linkedTransaction && amount > availableBalance) {
      setError("Insufficient trip wallet funds for this updated expense.");
      return;
    }

    const expenseData = {
      trip_id: selectedTrip.id,
      budget_category_id: Number(expenseCategoryId),
      wallet_id: activeTripWallet.id,
      description: expenseName.trim(),
      amount,
      currency: activeCurrency,
      expense_date: expenseDate,
      payment_method: paymentMethod,
    };

    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (editingExpenseId !== null && existingExpense) {
        await expenseApi.update(editingExpenseId, expenseData);
      } else {
        await expenseApi.create(expenseData);
      }
      resetExpenseForm();
      await loadData();
      setNotice("Expense and matching wallet withdrawal saved.");
    } catch (saveError) {
      console.error("Could not save expense:", saveError);
      setError(getErrorMessage(saveError, "Could not save expense."));
    } finally {
      setBusy(false);
    }
  }

  function startEditingExpense(expense) {
    setEditingExpenseId(expense.id);
    setExpenseName(expense.description);
    setExpenseAmount(String(expense.amount));
    setExpenseDate(String(expense.expense_date).slice(0, 10));
    setPaymentMethod(expense.payment_method || "Cash");
    setExpenseCategoryId(String(expense.budget_category_id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteExpense(expense) {
    if (
      !window.confirm(
        "Delete this expense? Its linked wallet withdrawal will be reversed.",
      )
    ) {
      return;
    }
    setDeletingExpenseId(expense.id);
    setError("");
    setNotice("");
    try {
      await expenseApi.remove(expense.id);
      if (String(editingExpenseId) === String(expense.id)) {
        resetExpenseForm();
      }
      await loadData();
      setNotice("Expense deleted and trip wallet balance restored.");
    } catch (deleteError) {
      console.error("Could not delete expense:", deleteError);
      setError(getErrorMessage(deleteError, "Could not delete expense."));
    } finally {
      setDeletingExpenseId(null);
    }
  }

  async function addPersonalWallet(event) {
    event.preventDefault();
    if (!personalWalletName.trim()) {
      setError("Enter a name for the wallet.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const wallet = await walletApi.createWallet({
        name: personalWalletName.trim(),
        balance: 0,
        currency: personalWalletCurrency,
      });
      setWallets((current) => [...current, wallet]);
      setPersonalWalletName("");
      setNotice("Personal wallet created.");
    } catch (createError) {
      console.error("Could not create personal wallet:", createError);
      setError(getErrorMessage(createError, "Could not create wallet."));
    } finally {
      setBusy(false);
    }
  }

  async function deletePersonalWallet(walletId) {
    if (!window.confirm("Delete this personal wallet?")) return;
    setBusy(true);
    setError("");
    try {
      await walletApi.deleteWallet(walletId);
      setWallets((current) => current.filter((item) => item.id !== walletId));
      setNotice("Personal wallet deleted.");
    } catch (deleteError) {
      console.error("Could not delete personal wallet:", deleteError);
      setError(getErrorMessage(deleteError, "Could not delete wallet."));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-full bg-slate-50 p-6 text-slate-600 sm:p-8">
        <div className="mx-auto max-w-6xl" role="status">
          Loading trips, budgets, expenses, and wallets…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Trip finances
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Budget &amp; wallet
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track trip budgets, category limits, expenses, and wallet funds.
            </p>
          </div>
          {trips.length > 0 && (
            <label className="min-w-64 text-sm font-medium text-slate-600">
              Active trip
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                onChange={(event) => selectTrip(event.target.value)}
                value={selectedTripId}
              >
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </header>

        {error && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <span>{error}</span>
            <button
              className="font-semibold underline"
              onClick={() => {
                setLoading(true);
                void loadData();
              }}
              type="button"
            >
              Reload data
            </button>
          </div>
        )}
        {notice && (
          <p
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            role="status"
          >
            {notice}
          </p>
        )}

        {trips.length === 0 ? (
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold">Create a trip to start budgeting</h2>
            <p className="mt-2 text-sm text-slate-500">
              Budgets, categories, expenses, and trip wallets are attached to a trip.
            </p>
            <a
              className="mt-5 inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white"
              href="/trips"
            >
              Go to My Trips
            </a>
          </section>
        ) : selectedTrip ? (
          <>
            <section
              aria-label="Trip budget overview"
              className="grid gap-4 sm:grid-cols-3"
            >
              <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">
                  Budget · {activeCurrency}
                </p>
                <form className="mt-2 flex gap-2" onSubmit={saveBudget}>
                  <input
                    aria-label="Trip budget amount"
                    className="min-w-0 flex-1 border-b border-slate-200 bg-transparent text-2xl font-bold outline-none focus:border-teal-600"
                    min="0"
                    onChange={(event) => setBudgetInput(event.target.value)}
                    step="0.01"
                    type="number"
                    value={budgetInput}
                  />
                  <button
                    className="rounded-lg bg-teal-50 px-3 text-xs font-bold text-teal-800 disabled:opacity-50"
                    disabled={busy}
                    type="submit"
                  >
                    Save
                  </button>
                </form>
                <p className="mt-2 text-xs text-slate-400">
                  {activeBudget ? "Saved trip budget" : "Budget not saved yet"}
                </p>
              </article>

              <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">Spent</p>
                <p className="mt-2 text-2xl font-bold">
                  {formatMoney(totalSpent, activeCurrency)}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {activeExpenses.length} expenses · calculated from expense records
                </p>
              </article>

              <article className="rounded-2xl bg-teal-800 p-5 text-white shadow-sm">
                <p className="text-sm font-medium text-teal-100">Budget remaining</p>
                <p className="mt-2 text-2xl font-bold">
                  {formatMoney(remaining, activeCurrency)}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-teal-300 transition-[width]"
                    style={{ width: `${spentPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-teal-100">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}
                  % used
                </p>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
              <div className="space-y-6">
                <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold">Expenses</h2>
                      <p className="text-sm text-slate-500">
                        Each new expense creates a wallet withdrawal.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {activeExpenses.length} items
                    </span>
                  </div>

                  {activeExpenses.length ? (
                    <ul className="divide-y divide-slate-100">
                      {activeExpenses.map((expense) => {
                        const category = activeCategories.find(
                          (item) =>
                            String(item.id) ===
                            String(expense.budget_category_id),
                        );
                        const isLinked = transactions.some(
                          (item) => item.source === `expense:${expense.id}`,
                        );
                        return (
                          <li
                            className="flex items-start justify-between gap-4 py-4"
                            key={expense.id}
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold">
                                {expense.description}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {category?.name || "Uncategorized"} ·{" "}
                                {expense.payment_method || "Payment method not set"} ·{" "}
                                {expense.expense_date}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {isLinked
                                  ? "Trip wallet withdrawal recorded"
                                  : "Legacy expense without linked wallet transaction"}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-2">
                              <strong>
                                {formatMoney(expense.amount, expense.currency)}
                              </strong>
                              <div className="flex gap-2">
                                <button
                                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold"
                                  onClick={() => startEditingExpense(expense)}
                                  type="button"
                                >
                                  Edit
                                </button>
                                <button
                                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
                                  disabled={deletingExpenseId === expense.id}
                                  onClick={() => void deleteExpense(expense)}
                                  type="button"
                                >
                                  {deletingExpenseId === expense.id
                                    ? "Deleting…"
                                    : "Delete"}
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                      No expenses for this trip yet.
                    </p>
                  )}
                </section>

                <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
                  <h2 className="text-lg font-bold">Budget categories</h2>
                  <ul className="mt-4 space-y-4">
                    {categoryTotals.map((category) => {
                      const percent =
                        Number(category.allocated_amount) > 0
                          ? Math.min(
                              (category.spent /
                                Number(category.allocated_amount)) *
                                100,
                              100,
                            )
                          : 0;
                      return (
                        <li key={category.id}>
                          <div className="mb-1.5 flex justify-between gap-3 text-sm">
                            <span>{category.name}</span>
                            <span className="text-slate-500">
                              {formatMoney(category.spent, activeCurrency)} /{" "}
                              {formatMoney(category.allocated_amount, activeCurrency)}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-teal-600"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                    {!categoryTotals.length && (
                      <li className="text-sm text-slate-500">
                        Add a category to start tracking category allocations.
                      </li>
                    )}
                  </ul>
                  <form
                    className="mt-5 grid gap-3 sm:grid-cols-[1fr_10rem_auto]"
                    onSubmit={addCategory}
                  >
                    <input
                      aria-label="New category name"
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      onChange={(event) => setCategoryName(event.target.value)}
                      placeholder="Category name"
                      value={categoryName}
                    />
                    <input
                      aria-label="Category budget allocation"
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      min="0"
                      onChange={(event) =>
                        setCategoryAllocation(event.target.value)
                      }
                      placeholder="Allocation"
                      step="0.01"
                      type="number"
                      value={categoryAllocation}
                    />
                    <button
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      disabled={busy || !activeBudget}
                      type="submit"
                    >
                      Add category
                    </button>
                  </form>
                  {!activeBudget && (
                    <p className="mt-2 text-xs text-amber-700">
                      Save a trip budget before adding categories.
                    </p>
                  )}
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <div>
                    <h2 className="text-lg font-bold">
                      {editingExpenseId !== null ? "Edit expense" : "Add an expense"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Expenses are linked to the selected trip budget category and wallet.
                    </p>
                  </div>
                  {activeTripWallet && (
                    <p className="mt-3 rounded-xl bg-teal-50 px-3 py-2 text-sm text-teal-900">
                      Wallet available:{" "}
                      <strong>
                        {formatMoney(
                          activeTripWallet.current_amount,
                          activeTripWallet.currency,
                        )}
                      </strong>
                    </p>
                  )}
                  <form className="mt-4 space-y-3" onSubmit={saveExpense}>
                    <label className="block text-sm font-medium text-slate-600">
                      Expense name
                      <input
                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                        onChange={(event) => setExpenseName(event.target.value)}
                        placeholder="e.g. Museum tickets"
                        required
                        value={expenseName}
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-600">
                      Budget category
                      <select
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        onChange={(event) =>
                          setExpenseCategoryId(event.target.value)
                        }
                        required
                        value={expenseCategoryId}
                      >
                        <option value="">Choose a category</option>
                        {activeCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-sm font-medium text-slate-600">
                        Amount ({activeCurrency})
                        <input
                          className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                          min="0.01"
                          onChange={(event) =>
                            setExpenseAmount(event.target.value)
                          }
                          required
                          step="0.01"
                          type="number"
                          value={expenseAmount}
                        />
                      </label>
                      <label className="block text-sm font-medium text-slate-600">
                        Date
                        <input
                          className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                          onChange={(event) => setExpenseDate(event.target.value)}
                          required
                          type="date"
                          value={expenseDate}
                        />
                      </label>
                    </div>
                    <label className="block text-sm font-medium text-slate-600">
                      Payment method
                      <select
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        onChange={(event) =>
                          setPaymentMethod(event.target.value)
                        }
                        value={paymentMethod}
                      >
                        {["Cash", "Card", "Bank transfer", "Other"].map(
                          (method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                        disabled={
                          busy ||
                          !activeBudget ||
                          !activeTripWallet ||
                          !activeCategories.length
                        }
                        type="submit"
                      >
                        {busy
                          ? "Saving…"
                          : editingExpenseId !== null
                            ? "Update expense"
                            : "Add expense & withdraw"}
                      </button>
                      {editingExpenseId !== null && (
                        <button
                          className="rounded-xl bg-slate-100 px-4 text-sm font-semibold"
                          onClick={resetExpenseForm}
                          type="button"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    {!activeBudget && (
                      <p className="text-xs text-amber-700">
                        Save the trip budget first.
                      </p>
                    )}
                    {!activeTripWallet && (
                      <p className="text-xs text-amber-700">
                        Create the trip wallet in the funding panel first.
                      </p>
                    )}
                    {!activeCategories.length && (
                      <p className="text-xs text-amber-700">
                        Add at least one budget category first.
                      </p>
                    )}
                  </form>
                </section>

                <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <h2 className="text-lg font-bold">Trip wallet</h2>
                  {activeTripWallet ? (
                    <>
                      <p className="mt-2 text-2xl font-bold">
                        {formatMoney(
                          activeTripWallet.current_amount,
                          activeTripWallet.currency,
                        )}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Target:{" "}
                        {formatMoney(
                          activeTripWallet.target_amount,
                          activeTripWallet.currency,
                        )}
                      </p>
                      <form
                        className="mt-4 flex gap-2"
                        onSubmit={addTripFunds}
                      >
                        <input
                          aria-label="Amount to add to trip wallet"
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          min="0.01"
                          onChange={(event) => setFundAmount(event.target.value)}
                          placeholder="Add funds"
                          required
                          step="0.01"
                          type="number"
                          value={fundAmount}
                        />
                        <button
                          className="rounded-xl bg-teal-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                          disabled={busy}
                          type="submit"
                        >
                          Deposit
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="mt-3">
                      <p className="text-sm text-slate-500">
                        A trip wallet is needed to fund expenses and record withdrawals.
                      </p>
                      <button
                        className="mt-3 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                        disabled={busy}
                        onClick={async () => {
                          setBusy(true);
                          setError("");
                          try {
                            await ensureTripWallet();
                            setNotice("Trip wallet created. Add funds to begin.");
                          } catch (createError) {
                            setError(
                              getErrorMessage(
                                createError,
                                "Could not create trip wallet.",
                              ),
                            );
                          } finally {
                            setBusy(false);
                          }
                        }}
                        type="button"
                      >
                        Create trip wallet
                      </button>
                    </div>
                  )}
                  <h3 className="mt-5 text-sm font-bold">Wallet activity</h3>
                  {activeTransactions.length ? (
                    <ul className="mt-2 divide-y divide-slate-100">
                      {activeTransactions.slice(0, 8).map((transaction) => (
                        <li
                          className="flex justify-between gap-3 py-2 text-xs"
                          key={transaction.id}
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-medium">
                              {transaction.description || transaction.source || "Transaction"}
                            </span>
                            <span className="text-slate-500">
                              {transaction.transaction_date} · {transaction.type}
                            </span>
                          </span>
                          <span
                            className={
                              transaction.type === "deposit"
                                ? "font-semibold text-emerald-700"
                                : "font-semibold text-slate-700"
                            }
                          >
                            {transaction.type === "deposit" ? "+" : "−"}
                            {formatMoney(
                              transaction.amount,
                              activeTripWallet?.currency,
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      No wallet transactions for this trip yet.
                    </p>
                  )}
                </section>
              </div>
            </section>
          </>
        ) : null}

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Personal wallets</h2>
              <p className="mt-1 text-sm text-slate-500">
                Account wallets are separate from trip wallets and their ledgers.
              </p>
            </div>
            <form
              className="flex flex-wrap gap-2"
              onSubmit={addPersonalWallet}
            >
              <input
                aria-label="Personal wallet name"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                onChange={(event) => setPersonalWalletName(event.target.value)}
                placeholder="Wallet name"
                value={personalWalletName}
              />
              <select
                aria-label="Personal wallet currency"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                onChange={(event) =>
                  setPersonalWalletCurrency(event.target.value)
                }
                value={personalWalletCurrency}
              >
                {["USD", "EUR", "GBP", "KHR", "JPY"].map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <button
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                disabled={busy}
                type="submit"
              >
                Create wallet
              </button>
            </form>
          </div>
          {wallets.length ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {wallets.map((wallet) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"
                  key={wallet.id}
                >
                  <div>
                    <p className="font-semibold">{wallet.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatMoney(wallet.balance, wallet.currency)}
                    </p>
                  </div>
                  <button
                    aria-label={`Delete ${wallet.name}`}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    disabled={busy}
                    onClick={() => void deletePersonalWallet(wallet.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No personal wallets yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default Budget;
