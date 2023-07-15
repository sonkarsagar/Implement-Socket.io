const email = document.getElementById("email");
const password = document.getElementById("password");

const submit = document.getElementById("submit");
const create = document.getElementById("create");

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const result = await axios.post("http://100.26.98.177:3000/login", {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem("token", result.data.token);
    if (result.data.value) {
      alert("Successfully Logged In");
      location.replace("http://100.26.98.177:3000/loggedIn/loggedIn.html");
    } else {
      alert("Incorrect Email/Password");
    }
  } catch (error) {
    alert("Incorrect Email/Password");
    console.log(error);
  }
});

create.addEventListener("click", (e) => {
  e.preventDefault();
  location.replace("http://100.26.98.177:3000/signUp/signup.html");
});
