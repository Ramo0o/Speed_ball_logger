
import { db, __dirname } from '../server.js';
import express from 'express';
import path from 'path';

//defining the router
const router = express.Router();


//endpoint to serve a specific user's numbers 
router.get("/",(req,res)=>{
    console.log('the numbers api')
    res.sendFile(path.join(__dirname, 'pages/public/today_number.html')),err =>{
        if(err){
            console.log(err.message)
        }
}})

//an endpoint that returns the user's data of all time which is more likeley to be changed due to computational constraints
router.get("/data",(req,res) => {
    let array = [];
    //a query to get the users numbers of all time 
    db.all(`SELECT * FROM 'number_views' 
        WHERE first_name ==  $firstName 
        AND last_name == $lastName`,
        {
            //here we're using the stored cookies because when it comes to viewing the only person who should see it 
            //is the authenticated user 
            $firstName: req.cookies.firstName,
            $lastName: req.cookies.lastName
        },
        //error checking to make sure the server doesn't crash if anything went wrong
        (err,rows) =>{
        // chose to shrink the error checking part into one line to make the code more concise 
        if(err) return res.status(500).send(err.message);

        //will probably wrap this into it's own function in future releases 
        rows.forEach(row =>{
            let obj = { 
                firstName : row.first_name,
                lastName : row.last_name,
                left : row.left,
                right : row.right,
                front : row.front,
                back : row.back ,
                total: row.total,
                minNumber: row.min_number,
                duration : row.duration 
            }
            array.push(obj)
            console.log(req.cookies.firstName,req.cookies.lastName)
        })
        console.log(req.cookies.firstName,req.cookies.lastName)
        console.log(`we're here`)
        res.status(200).send(array);
    });
});

//endpoint to get the admins privilege to view the numbers of all the users today 
router.get('admin',(res,req) =>{
    let array = []
    db.all(`SELECT * FROM number_views WHERE date == DATE(now)`,[], (err,rows) =>{
        if (err) return res.status(500).send(err.message)
        rows.forEach(row =>{
            let obj = {
                firstName : row.first_name,
                lastName : row.last_name,
                left : row.left,
                right : row.right,
                front : row.front,
                back : row.back ,
                total: row.total,
                minNumber: row.min_number,
                duration : row.duration 
            }
            array.push(obj)
        })
        console.log(row)
        res.send(array);
    })
})

//endpoint to insert new numbers 
router.post('/', (req,res) => {
    console.log('the post api')
    //a separate function to insert the new user's data 
    insertNumbers(req.body)


    //a function to write into an excel file that could be downloaded whenever needed 
    //writeToExcel(body)
})

//a function that would write all of the data into an excel file and return the file when requested by the admin
function writeToExcel(objects){

}
//a function still under work that checks if the user inputted multiple numbers in one field and separates each number
//and returns them in separate objects
function createObjects(body){
    let objectArray = new Array(body.dataNumbers).fill(null).map(()=>({}))
    let regex = new RegExp('[-_\/\\\\]')
    for(let key in body){
        for (let i in objectArray){
            objectArray[i][key] = array[i]
        }
    }
    return objectArray
    }

//a function to write into the db that takes an array of objects as arguments
function insertNumbers(object){
    console.log('we made it here')
    //insert the new data into the database 
    db.run(`INSERT INTO "numbers" ("left","right","front","back","duration", "player_id") 
        VALUES ($left,$right,$front,$back,$duration,
        (SELECT id FROM players 
        WHERE first_name == $firstName AND last_name == $lastName)
        )`,
        { 
        $left : object.left,
        $right: object.right,
        $front: object.front,
        $back: object.back,
        $duration: object.duration,
        //the reason why we're not using the stored firstname and lastName in the cookies is because on of the features 
        //include that you could insert anyone's data from your phone in case they don't have their own phone
        //which raises some privacy concerns like what if the a user decides to input wrong numbers and this problem will
         //probably be addressed in future versions
        $firstName: object.firstName,
        $lastName: object.lastName
    },err=>{
        console.log('inserted')
    })}
export {router as numbers}