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
  e.preventDefault();
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
      data.append(document.createTextNode("You: " + chat.value));
      row.append(data);
      tbody.append(row);
    })
    .catch((err) => {
      console.log(err);
    });
});

window.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  axios.get("http://localhost:3000/getChat", {headers: { Authorization: localStorage.getItem("token") },}).then((chat) => {
      chat.data.forEach((element) => {
        if(element.token===localStorage.getItem('token')){
            const row = document.createElement("tr");
            const data = document.createElement("td");
            data.append(document.createTextNode("You: " + element.chat));
            row.append(data);
            tbody.append(row);
        }else{
            axios.get(`http://localhost:3000/getUser/${element.UserId}`, {headers: { Authorization: localStorage.getItem("token") },}).then((user) => {
                const row = document.createElement("tr");
                const data = document.createElement("td");
                data.append(document.createTextNode(`${user.data.first} ${user.data.sur}: ` + element.chat));
                row.append(data);
                tbody.append(row);
            })
            .catch((err) => {
                console.log(err);
            });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
