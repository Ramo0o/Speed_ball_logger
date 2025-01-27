document.addEventListener("DOMContentLoaded", () => {
button = document.getElementById('login')
const nameRegex = new RegExp('\\b[^\\d]+\\b');
button.addEventListener('click',()=>{
    let firstName = document.getElementById('firstName').value
    let lastName = document.getElementById('lastName').value
    console.log('clicked')
    fetch("http://localhost:3000/api/user/login/submit",{
        method:"POST",
        body: JSON.stringify({
            firstName:firstName,
            lastName:lastName
        }),
        headers: {
            'Content-Type': 'application/json'
        } 
    })
})})