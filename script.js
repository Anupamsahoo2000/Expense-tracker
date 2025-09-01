document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseIdInput = document.getElementById("expense-id");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const expenseList = document.getElementById("expense-list");
  const submitBtn = document.getElementById("submit-btn");
  const formTitle = document.getElementById("form-title");
  const noExpensesMsg = document.getElementById("no-expenses-msg");

  // State management
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let isEditing = false;

  // --- FUNCTIONS ---

  // Save expenses to local storage
  const saveExpenses = () => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  };

  // Render expenses to the DOM
  const renderExpenses = () => {
    expenseList.innerHTML = ""; // Clear the list before rendering

    if (expenses.length === 0) {
      noExpensesMsg.classList.remove("d-none");
    } else {
      noExpensesMsg.classList.add("d-none");
      expenses.forEach((expense) => {
        const expenseElement = document.createElement("li");
        expenseElement.className =
          "list-group-item expense-item d-flex flex-wrap align-items-center justify-content-between";
        expenseElement.dataset.id = expense.id;

        expenseElement.innerHTML = `
                    <div class="d-flex align-items-center me-3">
                         <div class="p-2 bg-primary-subtle rounded-circle me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-wallet2 text-primary" viewBox="0 0 16 16"><path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5v-7A1.5 1.5 0 0 1 1.5 3H2V1.78a1.5 1.5 0 0 1 1.864-1.454l8.272 1.964ZM14 3H2V1.78a.5.5 0 0 1 .622-.484l8.272 1.964A.5.5 0 0 1 11.5 3.5H14Z"/><path d="M-5 3a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5ZM1.5 4a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-13Z"/></svg>
                        </div>
                        <div>
                            <p class="fw-semibold mb-0">${
                              expense.description
                            }</p>
                            <small class="text-muted">${
                              expense.category
                            }</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-2 mt-sm-0">
                        <span class="badge bg-success-subtle text-success-emphasis rounded-pill me-3 fs-6">₹${parseFloat(
                          expense.amount
                        ).toFixed(2)}</span>
                        <div class="btn-group" role="group">
                            <button class="edit-btn btn btn-sm btn-outline-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V12h2.293z"/></svg>
                            </button>
                            <button class="delete-btn btn btn-sm btn-outline-danger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zM4.118 4 4.5 8.5h7l.382-4.5zM2.846 13.138A1 1 0 0 1 3.874 15h8.252a1 1 0 0 1 .986-1.164l-.895-10.738H3.741z"/></svg>
                            </button>
                        </div>
                    </div>
                `;
        expenseList.appendChild(expenseElement);
      });
    }
  };

  // Reset form to its initial state
  const resetForm = () => {
    expenseForm.reset();
    isEditing = false;
    expenseIdInput.value = "";
    submitBtn.textContent = "Add Expense";
    submitBtn.classList.remove("btn-info");
    submitBtn.classList.add("btn-primary");
    formTitle.textContent = "Add New Expense";
  };

  // Handle form submission (add or edit)
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();
    const category = categoryInput.value;
    const expenseId = expenseIdInput.value;

    if (!description || !amount || !category) {
      return;
    }

    if (isEditing) {
      const expenseIndex = expenses.findIndex((exp) => exp.id == expenseId);
      if (expenseIndex > -1) {
        expenses[expenseIndex] = {
          id: Number(expenseId),
          description,
          amount,
          category,
        };
      }
    } else {
      const newExpense = {
        id: Date.now(),
        description,
        amount,
        category,
      };
      expenses.push(newExpense);
    }

    saveExpenses();
    renderExpenses();
    resetForm();
  });

  // Handle clicks on edit or delete buttons using event delegation
  expenseList.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const expenseElement = e.target.closest(".list-group-item");
    const id = expenseElement.dataset.id;

    if (button.classList.contains("delete-btn")) {
      expenses = expenses.filter((expense) => expense.id != id);
      saveExpenses();
      renderExpenses();
    }

    if (button.classList.contains("edit-btn")) {
      const expenseToEdit = expenses.find((expense) => expense.id == id);
      if (expenseToEdit) {
        isEditing = true;
        expenseIdInput.value = expenseToEdit.id;
        descriptionInput.value = expenseToEdit.description;
        amountInput.value = expenseToEdit.amount;
        categoryInput.value = expenseToEdit.category;

        formTitle.textContent = "Edit Expense";
        submitBtn.textContent = "Save Changes";
        submitBtn.classList.remove("btn-primary");
        submitBtn.classList.add("btn-info");

        expenseForm.scrollIntoView({ behavior: "smooth" });
        descriptionInput.focus();
      }
    }
  });

  // --- INITIALIZATION ---
  renderExpenses(); // Initial render on page load
});
