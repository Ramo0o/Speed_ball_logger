import express from 'express';
import path from 'path';
import { db , __dirname } from '../server.js';

//defining the router
const router = express.Router();

//setting up the middlewares specific to that route 
router.use(isAdmin);

//serving the admin home page after validating that he's an admin 
router.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'/admin/admin_home.html'));
})

//an endpoint to add new users 

router.post('/add_user',(req,res)=>{
    //add some input validation
    //running the insert query using prepared statements to avoid sql injection
    db.run(`INSERT INTO players 
        (first_name,last_name,min_number)
        VALUES
        ($firstName,$lastName,$minNumber)
        `,{
            $firstName:req.body.firstName,
            $lastName:req.body.lastName,
            $minNumber:req.body.minNumber,
        },
        //error checking so if anything went wrong the server doesn't crash
        err =>{
            if(err) return res.status(500).send(error.message);
            
            else{
                res.status(201)
            }

        })

})
//an endpoint to change the min number of a player
router.post('/change_min_number',(req,res)=>{
    //add some input validation 
    // connecting to the db and running the update query using prepared statements to avoid sql injection
    db.run(`UPDATE players
        SET min_number = $minNumber
        WHERE first_name = $firstName
        AND last_name = $lastName
        `,{
            $firstName:req.body.firstName,
            $lastName:req.body.lastName,
            $minNumber:req.body.minNumber
        },
        //error checking to make sure the server doesn't crash if anything went wrong 
        err=>{
            if(err) return res.status(500).send(err.message); // status code 500 indicates that something went wrong at the server 
            else{
                res.status(201)//status code 201 means everything went OKAY 
                }
            }
        )
})
//a middleware function to authorize users 
function isAdmin(req,res,next){
    console.log('the admin api')
    if(req.cookies.admin !== 1){
        res.status(401).redirect('/index.html')
    }
    next();
}

export {router as admin}