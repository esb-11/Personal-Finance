import { pubSub } from "../PubSub.js";
import { currentMonth } from "./MonthFilter.js";

const tableBody = document.querySelector("#finance-table > tbody");
const expenseTemplate = document.querySelector("#expense-template");

function makeTableElement(item) {
  if (currentMonth >= 0 && item.date.getMonth() != currentMonth) return;
  const template = expenseTemplate.content.cloneNode(true);
  const tr = template.querySelector("tr");;

  setPaidButton(item, tr.querySelector("input"));
  tr.querySelector(".due-date").innerText = makeDate(item.date);
  tr.querySelector(".expense-name").innerText = item.name;
  tr.querySelector(".expense-value").innerText = item.value;
  tr.querySelector(".expense-type").innerText = item.type;

  tr.classList.add(item.paid ? "paid" : "not-paid");
  tr.dataset.id = item.id;

  const deleteButton = tr.querySelector("button.delete-button");
  deleteButton.addEventListener("click", (e) => {
    deleteExpense(item);
  });

  tableBody.appendChild(tr);
}

function setPaidButton(expense, checkbox) {
  checkbox.checked = expense.paid;
  checkbox.addEventListener("change", (e) => {
    pubSub.emit("paidStatusChanged", expense.id);
  });
}

function  resetExpensesTable() {
  tableBody.innerHTML = "";
}

function deleteExpense(expense) {
  pubSub.emit("expenseDeleted", expense.id);
}

function makeDate(date) {
  const options = {
    month: "numeric",
    day: "numeric",
  };

  return date.toLocaleDateString("pt-BR", options);
}

export { makeTableElement, resetExpensesTable };
