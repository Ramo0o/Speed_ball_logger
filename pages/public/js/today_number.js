//refactor this code to make it cleaner 
document.addEventListener("DOMContentLoaded", () => {
    const dir_name = 'http://localhost:3000'
    //sending the request for the numbers to the server
    fetch(`${dir_name}/api/numbers/data`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(response.json);
        return response.json();
    })
    .then(data => {
        console.log(data)
        for (i of data){
            const element = document.getElementById('div1');
            const header = document.createElement("player_name");
            const para = document.createElement("p")
            para.classList.add('player_data')
            header.classList.add('player_name')
            let diff = i.total - i.minNumber
            const headerNode = document.createTextNode(`${i.firstName.toUpperCase()} ${i.lastName.toUpperCase()}`); 
            para.innerHTML= 
            `
    Left: ${i.left}<br>
    Right: ${i.right}<br>
    Front: ${i.front}<br>
    Back: ${i.back}<br>
    Total: ${i.total}<br>
    ⏱️ ${i.duration}s
    `;
            header.appendChild(headerNode); 
            element.appendChild(header);
            element.appendChild(para);
            
            console.log(i.firstName,i.lastName,i.right,i.left,i.front,i.back,i.duration)
        }
    })
    })
