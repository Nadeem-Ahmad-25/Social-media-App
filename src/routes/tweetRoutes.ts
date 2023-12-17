import { Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const router= Router();
const prisma = new PrismaClient();

//create tweet
router.post('/',async(req,res)=>{
    const {content,image, userId}= req.body;
    try{
        const result = await prisma.tweet.create({
            data:{ 
                content,
                image,
                userId // manage based on authenticated user
            },
        });
        res.send(result);
    }catch(err){
        res.status(404).send({error:"Error creating tweet"});
    }
    
})
// list all tweets
router.get('/',async(req,res)=>{
    const result = await prisma.tweet.findMany({
        include: {
            user : {
                select:{
                    id:true,
                    name:true,
                    username:true,
                    image:true
                },
            },
        },
});
    res.json(result);
})

//get one tweet
router.get('/:id',async(req,res)=>{
    const {id}= req.params;
    const result = await prisma.tweet.findUnique({where:{id:Number(id)}, include:{user:true}});
    res.send(result);
    if(!result){
       return res.status(404).json({message:"No unique tweet found"});
    }
   
})

//update tweet
// router.put('/:id',(req,res)=>{
//     const {id}= req.params;
//     res.status(501).json({error:'Not implemented:'});
// })

//delete tweet
router.delete('/:id',async(req,res)=>{
    const {id}= req.params;
    await prisma.tweet.delete({where:{id:Number(id)}})
    res.sendStatus(200);
})

export default router;