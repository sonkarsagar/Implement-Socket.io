
const email=document.getElementById('email')
const password=document.getElementById('password')

const submit=document.getElementById('submit')
const create=document.getElementById('create')

submit.addEventListener('click',(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3000/login', {
        email: email.value,
        password: password.value
    }).then((result) => {
        localStorage.setItem('token', result.data.token)
        if(result.data.value){
            alert('Successfully Logged In')
        }else{
            alert('Incorrect Email/Password')
        }
    }).catch((err) => {
        console.log(err);
    });
})

create.addEventListener('click',(e)=>{
    e.preventDefault()
    location.replace('http://localhost:5500/FRONTEND/signUp/signup.html')
})