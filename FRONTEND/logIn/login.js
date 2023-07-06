const email = document.getElementById("email");
const password = document.getElementById("password");

const submit = document.getElementById("submit");
const create = document.getElementById("create");

submit.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .post("http://localhost:3000/login", {
      email: email.value,
      password: password.value,
    })
    .then((result) => {
      localStorage.setItem("token", result.data.token);
      if (result.data.value) {
        alert("Successfully Logged In");
        // axios.post("http://localhost:3000/chat",{
        //       chat: 'joined',
        //     }, { headers: { Authorization: localStorage.getItem("token") } }).then((result) => {
        //     const row = document.createElement("tr");
        //     const data = document.createElement("td");
        //     data.append(document.createTextNode("You  " + result.data.chat));
        //     row.append(data);
        //     tbody.append(row);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
        location.replace(
          "http://localhost:5500/FRONTEND/loggedIn/loggedIn.html"
        );
      } else {
        alert("Incorrect Email/Password");
      }
    })
    .catch((err) => {
        alert("Can't Find User. Please Sign Up");
      console.log(err);
    });
});

create.addEventListener("click", (e) => {
  e.preventDefault();
  location.replace("http://localhost:5500/FRONTEND/signUp/signup.html");
});
