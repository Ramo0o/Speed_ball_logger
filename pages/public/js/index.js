
document.addEventListener("DOMContentLoaded", () => {
        let numberPage = document.getElementById('todays_number');
        const location = window.location.hostname;
        numberPage.href = 'http://localhost:3000/api/user/login';
        const submit = document.getElementById('submit');
    submit.addEventListener("click",() => {
        //a regexp to check the number which matches with (123-324 / 12_45/ 432\53) and other delimiters like -_\/
        const numberRegex = new RegExp('\\b\\d{2,3}([-_\/\\\\]\\d{2,3})?\\b');
        // a regexp to match with the names field which is very minimalistic and probably would get some improvements in future versions
        const nameRegex = new RegExp('\\b[^\\d]+\\b');
        let correctNumbers = checkInput(document.querySelectorAll('input[type="number"]'),numberRegex,'please enter a single number ')
        let correctNames = checkInput(document.querySelectorAll('input[type="text"]'),nameRegex,'Please Enter a valid name')
        if (!correctNames || !correctNumbers) return;


        
        let inputFields = document.getElementsByClassName('text_field');
        const duration = document.getElementById('centered-select').value

        //bundle them into an object to send to the server 
        let obj = inputIntObject(inputFields);

        //a function to send the data with the ability to send any extras with the request like duration here for example
        //TO-DO : make it more dynamic as it's currently only accepting the duration 
        // the reason why i'm postponing this task is because i currently don't see any reason to make it dynamic with the current project requirements 
        send_data(obj,duration);
        // a function to clear the input fields after submition because the submit button wouldn't work in production
        clearElements(inputFields);
    });
});

//a function to send data
function send_data(obj,duration){
    fetch(`http://localhost:3000/api/numbers/`,{
        method:"POST",
        body: JSON.stringify({
            ...obj,
            duration:duration
        }),
        headers: {
            'Content-Type': 'application/json'
        } 
    })
}
// a function to clear the input fields
function clearElements(args){
    for(let i in args){
        if (args[i].type === 'number'){
            args[i].value = 0 
        }
        else if (args[i].type === 'text'){
            args[i].value = '';
        }
    }
}
// a funciton to check the regexp and add the error class 
function checkInput(array,regex,error){
    let output = true
    for (let i of array){
        console.log(i.value)
        if(!regex.test(i.value)){
            i.value = ''  
            i.classList.add('error')
            output = false
        }
    }
    return output
}
//a function to bundle the input fields into one objects i chose to bundle this into a function because i had the feeling i would need it one day
function inputIntObject(inputs){
    let obj = {}
    for (let input of inputs){
        obj[input.id] = input.value.trim().toLowerCase()
    }
    return obj
}