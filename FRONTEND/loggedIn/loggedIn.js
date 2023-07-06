const chat = document.getElementById("chat");
const send = document.getElementById("send");
const tbody = document.getElementById("tbody");
const logOut = document.getElementById("logOut");

logOut.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.replace("http://localhost:5500/FRONTEND/logIn/login.html");
});

send.addEventListener("click", (e) => {
//   e.preventDefault();
  axios
    .post(
      "http://localhost:3000/postChat",
      {
        chat: chat.value,
      },
      { headers: { Authorization: localStorage.getItem("token") } }
    )
    .then((result) => {
      const row = document.createElement("tr");
      const data = document.createElement("td");
      data.appendChild(document.createTextNode("You: " + chat.value));
      row.appendChild(data);
      tbody.appendChild(row);
    })
    .catch((err) => {
      console.log(err);
    });
});

window.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();
    if(!localStorage.getItem('token')){
        location.replace('http://localhost:5500/FRONTEND/logIn/login.html')
    }
    try {
      const chat = await axios.get("http://localhost:3000/getChat", {
        headers: { Authorization: localStorage.getItem("token") },
      });
  
      for (const element of chat.data) {
        if (element.token == localStorage.getItem("token")) {
          console.log(element);
          const row = document.createElement("tr");
          const data = document.createElement("td");
          data.appendChild(document.createTextNode("You: " + element.chat));
          row.appendChild(data);
          tbody.appendChild(row);
        } else {
          console.log(element);
          const user = await axios.get(
            `http://localhost:3000/getUser/${element.UserId}`,
            {
              headers: { Authorization: localStorage.getItem("token") },
            }
          );
  
          const row = document.createElement("tr");
          const data = document.createElement("td");
          data.appendChild(
            document.createTextNode(
              `${user.data.first} ${user.data.sur}: ` + element.chat
            )
          );
          row.appendChild(data);
          tbody.appendChild(row);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
  