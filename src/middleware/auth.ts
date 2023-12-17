import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient, User} from "@prisma/client";

const prisma = new PrismaClient();

type AuthRequest = Request & {user?: User};

const SECRET_KET= process.env.SECRET_KET || "supersecret";
export async function authenticateToken(
    req:AuthRequest, 
    res:Response, 
    next: NextFunction
    ) {
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader?.split(" ")[1];
    if(!jwtToken){
        return res.sendStatus(403);
    }

    try{
        const payLoad = await jwt.verify(jwtToken, SECRET_KET) as {
            tokenId:number
        } ;
        const dbToken= await prisma.token.findUnique({
            where: {id: payLoad.tokenId},
            include:{user:true},
        })
        if(!dbToken?.valid || dbToken.expiration<new Date()){
            return res.sendStatus(403).json({error:'API token not valid'});
        }
        req.user=dbToken.user;
    }catch (e){
        return res.sendStatus(401);
    }
    next();
}