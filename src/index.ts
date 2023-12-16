import express  from "express";
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';

const app = express();
app.use(express.json());
app.use('/users',userRoutes);
app.use('/tweet',tweetRoutes);
app.get('/',(re,res)=> {
    res.send("Hello world");
})

// create user related endpoints 

// create user


app.listen(3000, ()=>{
    console.log("app listening on port 3000");
})
