import { Router } from "express";
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient } from "@prisma/client";
import { sendEmailToken } from "../services/emailServ";


const prisma = new PrismaClient();
const router = Router();

const EMAIL_TOKEN_EXPIRATION_TIMEOUT = 10;
const AUTHENTICATION_TOKEN_EXPIRATION_TIMEOUT = 12;
const SECRET_KET= process.env.SECRET_KET || "supersecret";

function generateEmailToken(): string {
    return Math.floor(100000 + Math.random() *900000).toString();
}

function generateAuthToken(tokenId:number): string {
    const jwtPayLoad = {tokenId};

    return jwt.sign(jwtPayLoad, SECRET_KET, {
        algorithm: 'HS256',
        noTimestamp: true,
    })
}
// create a user, if it doesn't exist
// generate the emailToken and send it to their email address
router.post('/login',async (req, res) => {
    const {email}=req.body;

    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_TIMEOUT * 60 * 1000);
try{
    const createdToken= await prisma.token.create({
        data: {
            type: 'EMAIL',
            emailToken,
            expiration,
            user:{
                connectOrCreate:{
                    where: {email},
                    create: {email},
                },
            },
        },
    });
    console.log(createdToken);
    await sendEmailToken(email,emailToken);
    res.sendStatus(200);
}catch(err) {
    console.log(err);
    res.sendStatus(500).json({error:"authentication error"});
}
});

//validate the emailToken
// generate the JWT toke lon lived
router.post('/validate',async (req, res) => {
    const {email,emailToken} = await req.body;
    //console.log(emailToken,email);
try{
    const dbEmailToken = await prisma.token.findUnique({
        where:{
            emailToken,
        },
        include:{
            user:true,
        },
    });
    console.log(dbEmailToken);
    if(!dbEmailToken || !dbEmailToken.valid){
        return res.sendStatus(401);
    }

    if(dbEmailToken.expiration< new Date()){
        return res.status(404).json({ error:"Token expired"});
    }

    if(dbEmailToken?.user?.email !== email){
        return res.status(401).json({ error:"not the right email"}); 
    }
    
    //at this point we are sure that the user is validated through the right email and token 
    const expiration = new Date(
        new Date().getTime() + AUTHENTICATION_TOKEN_EXPIRATION_TIMEOUT *60 *1000 *60
    )
    const apitoken = await prisma.token.create({
        data: {
            type: 'API',
            expiration,
            user:{
                connect:{
                    email,
                },
            },
        },
    }); 
    // creating a stateful JWT authentication token. this gives us the 
    // ability to change the token based on events and prevent user from loggin in explicitly

    //invalidate the email post login.
    await prisma.token.update({
        where:{id:dbEmailToken.id},
        data: {valid:false},
    });
    

    //generate the JWT token
    const authToken = generateAuthToken(apitoken.id);

    res.json({authToken});
}catch(err){
    console.log(err);
    res.sendStatus(500).json({error:"authentication error"});
}
});
export default router 