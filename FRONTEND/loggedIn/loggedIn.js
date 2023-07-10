const chat = document.getElementById("chat");
const send = document.getElementById("send");
const tbody = document.getElementById("tbody");
const logOut = document.getElementById("logOut");

logOut.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("message");
  location.replace("http://localhost:5500/FRONTEND/logIn/login.html");
});

send.addEventListener("click", async (e) => {
    // e.preventDefault();
  try {
    const result = await axios.post("http://localhost:3000/postChat", {
      chat: chat.value,
    }, { headers: { Authorization: localStorage.getItem("token")}});
    const row = document.createElement("tr");
    const data = document.createElement("td");
    const User=await axios.get(`http://localhost:3000/getUser/${result.data.UserId}`, { headers: { Authorization: localStorage.getItem("token")}})
    data.appendChild(document.createTextNode(`${User.data.first} ${User.data.sur}: ` + result.data.chat));
    row.appendChild(data);
    tbody.appendChild(row);
  } catch (error) {
    console.log(err);
  }
});

window.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  if (!localStorage.getItem("token")) {
    location.replace("http://localhost:5500/FRONTEND/logIn/login.html");
  }
  if(!localStorage.getItem("message")){
    localStorage.setItem('message',JSON.stringify([]))
  }
  try {
    tbody.innerHTML = "";
    const chat = await axios.get(`http://localhost:3000/getChat/${JSON.parse(localStorage.getItem('message'))[-1]}`, {headers: {Authorization: localStorage.getItem("token")}})
    if(chat){
      message=JSON.parse(localStorage.getItem('message'))
      message=message.concat(chat.data)
      message=message.slice(-11)
      localStorage.setItem('message',JSON.stringify(message))
    }
    array=JSON.parse(localStorage.getItem('message'))
    for(element of array){
      const row = document.createElement("tr");
      const data = document.createElement("td");
      const User=await axios.get(`http://localhost:3000/getUser/${element.UserId}`, { headers: { Authorization: localStorage.getItem("token")}})
      data.appendChild(document.createTextNode(`${User.data.first} ${User.data.sur}: ` + element.chat));
      row.appendChild(data);
      tbody.appendChild(row);
    }
    
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("message");
    location.replace("http://localhost:5500/FRONTEND/logIn/login.html");
    console.log(err);
  }
});
