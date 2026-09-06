const ctx = document.getElementById("cashFlowChart");

let cashFlowChart = new Chart(ctx, {
  type: "bar",

  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],

    datasets: [
      {
        label: "Income",
        data: Array(12).fill(0),
        backgroundColor: "#166534",
      },

      {
        label: "Expense",
        data: Array(12).fill(0),
        backgroundColor: "#991b1b",
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        stacked: false,
      },

      y: {
        beginAtZero: true,
      },
    },
  },
});

function updateChart() {
  let income = Array(12).fill(0);
  let expense = Array(12).fill(0);

  transactionArr.forEach((item) => {
    let date = new Date(item.date);

    let month = date.getMonth();

    if (item.type === "income") {
      income[month] += Number(item.amt);
    } else {
      expense[month] += Number(item.amt);
    }
  });

  cashFlowChart.data.datasets[0].data = income;

  cashFlowChart.data.datasets[1].data = expense;

  cashFlowChart.update();
}

let dashboard = document.querySelector("#dashboard-view");
let settings = document.querySelector("#settings-view");

let sidebarMenu = document.querySelector(".sidebar-menu");

sidebarMenu.addEventListener("click", (e) => {
  let name = e.target.closest("[data-target]").dataset.target;
  console.log(name);
  document.querySelectorAll("[data-target]").forEach((element) => {
    element.classList.remove("active");
  });
  if (name === "dashboard-view") {
    settings.style.display = "none";
    dashboard.style.display = "block";
    e.target.classList.add("active");
  } else {
    dashboard.style.display = "none";
    settings.style.display = "block";
    e.target.classList.add("active");
  }
});

let addTransaction = document.querySelector("#openAddTransaction");
let transactionModal = document.querySelector("#transactionModal");
let transactionTableBody = document.querySelector("#transactionTableBody");
let save = document.querySelector(".save");
let txType = document.querySelector("#txType");
let txDescription = document.querySelector("#txDescription");
let txAmount = document.querySelector("#txAmount");
let txDate = document.querySelector("#txDate");
let txCategory = document.querySelector("#txCategory");
let transactionForm = document.querySelector("#transactionForm");
let closeModal = document.querySelector(".close-modal");
let displayBalance = document.querySelector("#displayBalance");
let displayIncome = document.querySelector("#displayIncome");
let displayExpense = document.querySelector("#displayExpense");
let displayCount = document.querySelector("#displayCount");
let resetDataBtn = document.querySelector("#resetDataBtn");
let logoutBtn = document.querySelector("#logoutBtn");
let topbarName = document.querySelector("#topbarName");

let transactionUserObj = JSON.parse(localStorage.getItem("user"));
let transactionUser = transactionUserObj.username;
let transactionArr =
  JSON.parse(localStorage.getItem(`transactions_${transactionUser}`)) || [];

let settingName = document.querySelector("#settingName");
let settingCurrency = document.querySelector("#settingCurrency");
let currency = document.querySelectorAll("#currency");
let settingsForm = document.querySelector("#settingsForm");

let typeFilter = document.querySelector("#typeFilter");
let searchInput = document.querySelector("#searchInput");

let curr = "$";
let currentCurr;

let setCurrency = () => {
  let userObj = JSON.parse(localStorage.getItem("user"));
  if (!userObj) {
    window.location.href = "index.html";
    return;
  }
  console.log(userObj);
  topbarName.textContent = userObj.username;
  currency.forEach((elem) => {
    elem.textContent = userObj.currency;
  });

  currentCurr = userObj.currency;
};

setCurrency();

logoutBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

let userName = "";

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  topbarName.textContent = settingName.value;
  userName = settingName.value;
  currency.forEach((elem) => {
    elem.textContent = settingCurrency.value;
    curr = settingCurrency.value;
  });
  alert("Settings saved successfully!");
  let user = {
    username: userName,
    currency: curr,
  };

  settingsForm.reset();
  localStorage.setItem("user", JSON.stringify(user));
  setCurrency();
  ui();
});

addTransaction.addEventListener("click", () => {
  transactionModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  transactionForm.reset();
  transactionModal.style.display = "none";
});

let mainStructure = (elem, index) => {
  let sign = elem.type.toLowerCase() === "expense" ? "-" : "+";
  let currAmt = sign + currentCurr + elem.amt;
  transactionTableBody.innerHTML += `
   <tr>
                        <td>${elem.date}</td>
                        <td><strong>${elem.desc}</strong></td>
                        <td><span class="tag">${elem.ctgy}</span></td>
                        <td class="${elem.type}">${currAmt}</td>
                        <td>
                          <button
                            class="action-btn btn-edit"
                            onclick="editTransaction('${elem.id}')"
                          >
                            <i class="fa-solid fa-pen"></i>
                          </button>
                          <button
                            class="action-btn btn-delete"
                            onclick="deleteTransaction(${index})"
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
   `;
};

let ui = (filterState = "all") => {
  transactionTableBody.innerHTML = "";
  transactionArr.forEach((elem, index) => {
    if (filterState === "all" || elem.type.toLowerCase() === filterState) {
      mainStructure(elem, index);
    }
  });
};

ui();
let editId = null;

let count;
let curBal;
let curIncome;
let curExpense;
function countAmount() {
  count = transactionArr.length;
  displayCount.textContent = count;

  curBal = 0;
  curIncome = 0;
  curExpense = 0;
  transactionArr.forEach((item) => {
    let value = Number(item.amt);
    let txt = item.type.toLowerCase();
    if (txt === "expense") {
      curExpense += value;
    } else {
      curIncome += value;
    }
  });

  curBal = curIncome - curExpense;
  displayBalance.textContent = curBal + ".00";
  displayIncome.textContent = curIncome + ".00";
  displayExpense.textContent = curExpense + ".00";
  updateChart();
}
countAmount();

transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    !txType.value ||
    !txAmount.value ||
    !txDescription.value ||
    !txDate.value ||
    !txCategory.value
  ) {
    // console.log("validation failed");
    return;
  }

  let type = txType.value.toLowerCase();
  let localUser = JSON.parse(localStorage.getItem("user"));

  let amt = Number(txAmount.value);

  let desc = txDescription.value;

  let date = txDate.value;
  let ctgy = txCategory.value;

  let obj = {
    id: crypto.randomUUID(),
    type,
    desc,
    amt,
    date,
    ctgy,
  };
  console.log(obj);
  if (editId === null) {
    transactionArr.push(obj);
    localStorage.setItem(
      `transactions_${transactionUser}`,
      JSON.stringify(transactionArr),
    );
    countAmount();
  } else {
    let index = transactionArr.findIndex((item) => {
      return item.id === editId;
    });
    transactionArr[index] = {
      id: editId,
      ...obj,
    };
    localStorage.setItem(
      `transactions_${transactionUser}`,
      JSON.stringify(transactionArr),
    );
    countAmount();
    editId = null;
  }
  ui();
  transactionForm.reset();
  transactionModal.style.display = "none";
});

function deleteTransaction(index) {
  transactionArr.splice(index, 1);
  localStorage.setItem(
    `transactions_${transactionUser}`,
    JSON.stringify(transactionArr),
  );
  countAmount();
  ui();
}

function editTransaction(id) {
  editId = id;
  console.log(id);
  transactionModal.style.display = "flex";
  save.textContent = "Update Transaction";
  transactionArr.find((item) => {
    if (item.id === id) {
      txType.value = item.type;
      txDescription.value = item.desc;
      let value = Number(item.amt);
      txAmount.value = value;
      txDate.value = item.date;
      txCategory.value = item.ctgy;
    }
  });
  countAmount();
}

typeFilter.addEventListener("change", (e) => {
  searchInput.value = "";
  ui(e.target.value);
});
searchInput.addEventListener("input", (e) => {
  transactionTableBody.innerHTML = "";
  let inp = e.target.value.toLowerCase();

  transactionArr.forEach((item, index) => {
    if (item.desc.toLowerCase().includes(inp)) {
      mainStructure(item, index);
    }
  });
});

let darkModeToggle = document.querySelector("#darkModeToggle");

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("Theme", "darkMode");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("Theme", "lightMode");
  }
});

let theme = localStorage.getItem("Theme");
console.log(theme);
let themeMode = () => {
  if (theme === "darkMode") {
    document.body.classList.add("dark");
    darkModeToggle.checked = true;
  } else {
    document.body.classList.remove("dark");
    darkModeToggle.checked = false;
  }
};

themeMode();

let clearAllWarn = document.querySelector(".clearAllWarn");
let Reset = document.querySelector("#Reset");
let Cancel = document.querySelector("#Cancel");

resetDataBtn.addEventListener("click", () => {
  if (curBal !== 0) {
    clearAllWarn.style.display = "flex";
  }
});

Reset.addEventListener("click", () => {
  transactionArr = [];
  localStorage.setItem(
    `transactions_${transactionUser}`,
    JSON.stringify(transactionArr),
  );
  ui();
  countAmount();
  clearAllWarn.style.display = "none";
});

Cancel.addEventListener("click", () => {
  clearAllWarn.style.display = "none";
});
