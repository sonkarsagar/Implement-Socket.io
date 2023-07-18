const first = document.getElementById("first");
const sur = document.getElementById("sur");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const logIn = document.getElementById("logIn");

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const result = await axios.post("http://localhost:3000/postUser", {
      first: first.value,
      sur: sur.value,
      email: email.value,
      password: password.value,
    });
    alert("Successfully Signed Up");
    location.replace("http://localhost:3000/logIn/login.html");
  } catch (error) {
    alert('User already exists. Please log in.')
    console.log(error);
  }
});

logIn.addEventListener("click", (e) => {
  e.preventDefault();
  location.replace("http://localhost:3000/logIn/login.html");
});
