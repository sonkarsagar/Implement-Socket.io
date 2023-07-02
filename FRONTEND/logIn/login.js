
const email=document.getElementById('email')
const password=document.getElementById('password')
const submit=document.getElementById('submit')
const create=document.getElementById('create')

submit.addEventListener('click',(e)=>{
    e.preventDefault()
    axios.post('http://3.82.230.183/login',{
        email: email.value,
        password: password.value
    }).then((res) => {
        localStorage.setItem("token",res.data.token)
        alert('Successfully Logged In')
        location.replace("http://3.82.230.183/loggedIn/index.html");
    }).catch((err) => {
        // console.log(err.status);
        alert("WRONG CREDENTIAL OR USER DOESN'T EXISTS.")
    });
})

create.addEventListener('click',(e)=>{
    e.preventDefault()
    location.replace('http://3.82.230.183/signUp/signup.html')
})