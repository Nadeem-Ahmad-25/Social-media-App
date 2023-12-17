import express  from "express";
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/user',userRoutes);
app.use('/tweet',tweetRoutes);
app.use('/auth',authRoutes);
app.get('/',(re,res)=> {
    res.send("Hello world");
})
app.listen(3000, ()=>{
    console.log("app listening on port 3000");
})
