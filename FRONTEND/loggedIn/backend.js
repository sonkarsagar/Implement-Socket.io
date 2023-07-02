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
  location.replace("http://3.82.230.183/logIn/login.html");
  localStorage.removeItem("token");
});

download.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .get("http://3.82.230.183/expense/download", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((result) => {
      location.replace(result.data.Location);
    })
    .catch((err) => {
      console.log(err);
    });
});

premium.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .get("http://3.82.230.183/expense/premium", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((response) => {
      let options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: function (response) {
          axios.post(
            "http://3.82.230.183/expense/successTransaction",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: localStorage.getItem("token") } }
          );
          alert("You are a Premium User");
          location.replace("http://3.82.230.183/loggedIn/premiumIndex.html");
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();

      rzp1.on("payment.failed", function (response) {
        axios.post(
          "http://3.82.230.183/expense/failTransaction",
          {
            order_id: options.order_id,
          },
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        alert("Something went wrong");
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

submit.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .post(
      "http://3.82.230.183/expense",
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
        `http://3.82.230.183/expense/${e.target.parentElement.parentElement.id}`
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }
});

const page = 1;

window.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("limit")) {
    localStorage.setItem('limit', 5)
  }
  if (!localStorage.getItem("token")) {
    return location.replace("http://3.82.230.183/logIn/login.html");
  }
  axios
    .get("http://3.82.230.183/user", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((result) => {
      if (result.data[0].premiumUser == true) {
        location.replace("http://3.82.230.183/loggedIn/premiumIndex.html");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  axios
    .get(
      `http://3.82.230.183/expense/pagination?page=${page}&limit=${localStorage.getItem(
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
      `http://3.82.230.183/expense/pagination?page=${page}&limit=${localStorage.getItem(
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
