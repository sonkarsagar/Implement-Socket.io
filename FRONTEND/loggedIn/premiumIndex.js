const amount = document.getElementById("expense");
const description = document.getElementById("description");
const category = document.getElementById("category");
const list = document.getElementById("list");
const submit = document.getElementById("submit");
const premium = document.getElementById("premium");
const logOut = document.getElementById("logout");
const tBody = document.getElementById("tbody");
const download = document.getElementById("download");
const pageElement = document.getElementById("page");
const previousNode = document.getElementById("previous");
const currentNode = document.getElementById("current");
const nextNode = document.getElementById("next");
const pageDropValue = document.getElementById("pageDropValue");
const span = document.getElementById("span");

logOut.addEventListener("click", (e) => {
  e.preventDefault();
  location.replace("http://54.161.199.191/logIn/login.html");
  localStorage.removeItem("token");
});

download.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .get("http://54.161.199.191/expense/download", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((result) => {
      location.replace(result.data.Location);
    })
    .catch((err) => {
      console.log(err);
    });
});

leaderboard.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .get("http://54.161.199.191/expense/premium/leaderboard")
    .then((result) => {
      count=1
      result.data.forEach((element) => {
        
        const row = document.createElement("tr");
        row.setAttribute("id", element.id);

        const lrank = document.createElement("td");
        lrank.appendChild(document.createTextNode(count));
        count++
        const lname = document.createElement("td");
        lname.appendChild(document.createTextNode(element.name));

        const lexpense = document.createElement("td");
        lexpense.appendChild(document.createTextNode(element.totalExpense));

        row.appendChild(lrank);
        row.appendChild(lname);
        row.appendChild(lexpense);

        boardbody.appendChild(row);
        
      });
    })
    .catch((err) => {});
});

submit.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .post(
      "http://54.161.199.191/expense",
      {
        date: new Date().toString().slice(4, 15),
        description: description.value,
        category: category.value,
        amount: amount.value,
      },
      { headers: { Authorization: localStorage.getItem("token") } }
    )
    .then((res) => {
      const deleteb = document.createElement("button");
      deleteb.setAttribute("class", "btn btn-danger btn-sm");
      deleteb.setAttribute("type", "button");
      deleteb.appendChild(document.createTextNode("Delete"));

      const tableRow = document.createElement("tr");
      tableRow.setAttribute("id", res.data.id);

      const date = document.createElement("td");
      date.appendChild(document.createTextNode(res.data.date));

      const cdescreption = document.createElement("td");
      cdescreption.appendChild(document.createTextNode(res.data.description));

      const ccategory = document.createElement("td");
      ccategory.appendChild(document.createTextNode(res.data.category));

      const income = document.createElement("td");
      income.appendChild(document.createTextNode(res.data.income));

      const expense = document.createElement("td");
      expense.appendChild(document.createTextNode(res.data.expense));

      const kuchBhi = document.createElement("td");
      kuchBhi.appendChild(deleteb);

      tableRow.appendChild(date);
      tableRow.appendChild(cdescreption);
      tableRow.appendChild(ccategory);
      tableRow.appendChild(income);
      tableRow.appendChild(expense);
      tableRow.appendChild(kuchBhi);

      tBody.prepend(tableRow);
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
});

tBody.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("btn-danger")) {
    tbody.removeChild(e.target.parentElement.parentElement);

    axios
      .delete(
        `http://54.161.199.191/expense/${e.target.parentElement.parentElement.id}`
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }
});

const page = 1;

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(
      `http://54.161.199.191/expense/pagination?page=${page}&limit=${localStorage.getItem(
        "limit"
      )}`,
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    )
    .then((res) => {
      showPagination(res.data);

      res.data.result.reverse().forEach((element) => {
        const deleteb = document.createElement("button");
        deleteb.setAttribute("class", "btn btn-danger btn-sm");
        deleteb.setAttribute("type", "button");
        deleteb.appendChild(document.createTextNode("Delete"));

        const tableRow = document.createElement("tr");
        tableRow.setAttribute("id", element.id);

        const date = document.createElement("td");
        date.appendChild(document.createTextNode(element.date));

        const cdescreption = document.createElement("td");
        cdescreption.appendChild(document.createTextNode(element.description));

        const ccategory = document.createElement("td");
        ccategory.appendChild(document.createTextNode(element.category));

        const income = document.createElement("td");
        income.appendChild(document.createTextNode(element.income));

        const expense = document.createElement("td");
        expense.appendChild(document.createTextNode(element.expense));

        const kuchBhi = document.createElement("td");
        kuchBhi.appendChild(deleteb);

        tableRow.appendChild(date);
        tableRow.appendChild(cdescreption);
        tableRow.appendChild(ccategory);
        tableRow.appendChild(income);
        tableRow.appendChild(expense);
        tableRow.appendChild(kuchBhi);

        tBody.prepend(tableRow);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

function getExpenses(page) {
  tbody.innerHTML = "";
  axios
    .get(
      `http://54.161.199.191/expense/pagination?page=${page}&limit=${localStorage.getItem(
        "limit"
      )}`,
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    )
    .then((res) => {
      showPagination(res.data);
      res.data.result.reverse().forEach((element) => {
        const deleteb = document.createElement("button");
        deleteb.setAttribute("class", "btn btn-danger btn-sm");
        deleteb.setAttribute("type", "button");
        deleteb.appendChild(document.createTextNode("Delete"));

        const tableRow = document.createElement("tr");
        tableRow.setAttribute("id", element.id);

        const date = document.createElement("td");
        date.appendChild(document.createTextNode(element.date));

        const cdescreption = document.createElement("td");
        cdescreption.appendChild(document.createTextNode(element.description));

        const ccategory = document.createElement("td");
        ccategory.appendChild(document.createTextNode(element.category));

        const income = document.createElement("td");
        income.appendChild(document.createTextNode(element.income));

        const expense = document.createElement("td");
        expense.appendChild(document.createTextNode(element.expense));

        const kuchBhi = document.createElement("td");
        kuchBhi.appendChild(deleteb);

        tableRow.appendChild(date);
        tableRow.appendChild(cdescreption);
        tableRow.appendChild(ccategory);
        tableRow.appendChild(income);
        tableRow.appendChild(expense);
        tableRow.appendChild(kuchBhi);

        tBody.prepend(tableRow);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function showPagination({ previous, current, next, start, end, count }) {
  pageElement.innerHTML = "";
  if (previous) {
    const btn1 = document.createElement("button");
    btn1.setAttribute("type", `button`);
    btn1.setAttribute("class", `btn btn-secondary btn1`);
    btn1.setAttribute("id", `previous`);
    btn1.appendChild(document.createTextNode(`${previous}`));
    btn1.addEventListener("click", (e) => {
      getExpenses(parseInt(e.target.childNodes[0].wholeText));
    });
    pageElement.appendChild(btn1);
  }
  const btn2 = document.createElement("button");
  btn2.setAttribute("type", `button`);
  btn2.setAttribute("class", `btn btn-primary btn2`);
  btn2.setAttribute("id", `current`);
  btn2.appendChild(document.createTextNode(`${current}`));
  btn2.addEventListener("click", (e) => {
    getExpenses(parseInt(e.target.childNodes[0].wholeText));
  });
  pageElement.appendChild(btn2);
  if (next) {
    const btn3 = document.createElement("button");
    btn3.setAttribute("type", `button`);
    btn3.setAttribute("class", `btn btn-secondary btn3`);
    btn3.setAttribute("id", `next`);
    btn3.appendChild(document.createTextNode(`${next}`));
    btn3.addEventListener("click", (e) => {
      getExpenses(parseInt(e.target.childNodes[0].wholeText));
    });
    pageElement.appendChild(btn3);
  }
  span.innerHTML = `${start} - ${end} of ${count}`;
}

pageDropValue.addEventListener("change", (e) => {
  e.preventDefault();
  // limit = parseInt(pageDropValue.value);
  localStorage.setItem("limit", parseInt(pageDropValue.value));
  location.reload();
});
