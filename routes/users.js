import express from 'express';
import path from 'path';
import { db, __dirname} from '../server.js';
import { SlowBuffer } from 'buffer';

//defining the router
const router = express.Router();


//setting up the middlewares specific to that route
router.use(isAuthenticated);


//an endpoint to log in the user 
router.post('/login/submit',(req,res)=>{
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    //running a query to search for the user and check their authorization status 
    db.get(`SELECT admin FROM players
        WHERE first_name == $firstName
        AND last_name == $lastName`,{
            $firstName: firstName,
            $lastName: lastName
            },
            //error checking to make sure everything went okay and to make sure the server doesn't crash if anything went wrong
            //note to self: perhaps add more verbose error checking in the future
            (err,row) =>{
                if(err) return res.status(500).send(err.message); //status code 500 indicates that something went wrong 
                    
                //saving the user's first name and last name as cookies so the next time they visit the website they don't
                //have to go through the hoops of logging in again
                res.cookie('firstName', req.body.firstName, { httpOnly: true })
                res.cookie('lastName', req.body.lastName, { httpOnly: true });
                console.log('users api')
                console.log(row.admin)

                //checking the user's  authorized status and also saving it in a cookie which is probably not the best 
                //security choice but it's sufficient for now 
                if (row.admin === 1){
                    res.cookie('admin', row.admin, { httpOnly: true })
                    res.redirect("../admin")
                    console.log('he is an admin');
                }
                else{
                    res.cookie('admin', row.admin, { httpOnly: true });
                    res.redirect(`../numbers/`)
                    console.log('redirected')
                }
            })
})
//a route to serve the login page if the user was not authorized 
router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, 'pages/public/login.html'))
})

//a function to check if the user had already logged in and redirect them to their respectful endpoints accordingly 
function isAuthenticated(req, res, next){
    console.log(req.cookies.firstName,'first name is authenticated')
    console.log(req.cookies.lastName,'lastName is authenticated')
    console.log(req.cookies.admin)
    if(req.cookies.admin == 0){
        console.log('redirecting to the numbers')
        res.redirect(`../numbers`)
    }
    else if(req.cookies.admin == 1){
        res.redirect('../admin')
        console.log('redirecting to the admin')
    }
    else{
        console.log('passing on ')
        next()
    }
}

export {router as users}