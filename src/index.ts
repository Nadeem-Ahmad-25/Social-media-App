import express  from "express";
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from "./middleware/auth"; 

const app = express();
app.use(express.json());
app.use('/user',authenticateToken,userRoutes);
app.use('/tweet',authenticateToken,tweetRoutes);
app.use('/auth',authRoutes);
app.get('/',(re,res)=> {
    res.send("Hello world");
})
app.listen(3000, ()=>{
    console.log("app listening on port 3000");
})
