document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:3000/api/numbers/admin`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(response.json)
        return response.json();
    })
    .then(data => {
        for (i of data){
            const element = document.getElementById('div1');
            const header = document.createElement("h1");
            const para = document.createElement("p")
            para.classList.add('data')
            header.classList.add('header')
            const headerNode = document.createTextNode(`${i.firstName.toUpperCase()} ${i.lastName.toUpperCase()}`); 
            para.innerHTML= 
            `
    Left: ${i.left}<br>
    Right: ${i.right}<br>
    Front: ${i.front}<br>
    Back: ${i.back}<br>
    Total: ${i.total}<br>
    ⏱️ ${i.duration}s`;
            header.appendChild(headerNode); 
            element.appendChild(header);
            element.appendChild(para);
            
            console.log(i.firstName,i.lastName,i.right,i.left,i.front,i.back,i.duration)
        }
    })
    })
