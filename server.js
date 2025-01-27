//note to self sort these alphabetically 
import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {numbers} from'./routes/numbers.js';
import {users} from'./routes/users.js';
import {admin} from './routes/admin.js';

//setting up some constants 
const app = express();
const port = process.env.PORT || 3000; //if there's an enviroment variable for the port use it else use port 3000 (for development) 
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // the path to the current dir 
const db =  new sqlite3.Database('tracker.db');//a db object to access the db at any time
//setting up some middlewares 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'pages','public')));
app.use(express.static(path.join(__dirname,'pages','media')));
app.use(cors());
//defining the routes for similar api endpoints   
app.use('/api/numbers', numbers)
app.use('/api/user', users)
app.use('/api/admin', admin) 

// route to return the homepage of someone accessed the root dir 
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'))
})




app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`)
})
//exporting constants that are used a lot in other files and routers 
export { db, __dirname };