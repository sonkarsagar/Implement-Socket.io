const first=document.getElementById('first')
const sur=document.getElementById('sur')
const email=document.getElementById('email')
const password=document.getElementById('password')
const submit=document.getElementById('submit')
const logIn=document.getElementById('logIn')

submit.addEventListener('click',async (e)=>{
    e.preventDefault()
    axios.post('http://localhost:3000/postUser', {
        first: first.value,
        sur: sur.value,
        email: email.value,
        password: password.value
    }).then((result) => {
        alert('Successfully Signed Up')
        location.replace('http://localhost:5500/FRONTEND/logIn/login.html')
    }).catch((err) => {
        alert('User Already Exists, Please Login')
        console.log(err);
    });

})

logIn.addEventListener('click',(e)=>{
    e.preventDefault()
    location.replace('http://localhost:5500/FRONTEND/logIn/')
})