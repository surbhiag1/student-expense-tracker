const form = document.querySelector("#expense-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const expensesList = document.querySelector("#expenses");
const totalOutput = document.querySelector("#total");
const countOutput = document.querySelector("#count");
const clearButton = document.querySelector("#clear");

let expenses = JSON.parse(localStorage.getItem("student-expenses") || "[]");

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

function saveAndRender() {
  localStorage.setItem("student-expenses", JSON.stringify(expenses));
  render();
}

function render() {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  totalOutput.textContent = formatMoney(total);
  countOutput.textContent = expenses.length;
  expensesList.replaceChildren();

  if (!expenses.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No expenses yet. Add your first one above.";
    expensesList.append(empty);
    return;
  }

  [...expenses].reverse().forEach((item) => {
    const li = document.createElement("li");
    li.className = "expense";
    const details = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.description;
    const meta = document.createElement("small");
    meta.textContent = `${item.category} · ${item.date}`;
    details.append(title, meta);
    const amount = document.createElement("strong");
    amount.textContent = formatMoney(item.amount);
    li.append(details, amount);
    expensesList.append(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  if (!description || !Number.isFinite(amount) || amount <= 0) return;

  expenses.push({ description, amount, category: categoryInput.value, date: new Date().toLocaleDateString("en-IN") });
  form.reset();
  saveAndRender();
});

clearButton.addEventListener("click", () => {
  if (expenses.length && confirm("Delete all saved expenses?")) {
    expenses = [];
    saveAndRender();
  }
});

render();
