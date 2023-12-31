import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router= Router();
const prisma = new PrismaClient();

//creat user
router.post('/',async(req,res)=>{
    const {email, name, username} = req.body;
    try{
        const result = await prisma.user.create({data:{
            email,
            name,
            username
        }, 
        });
        res.json(result);
        console.log(email,name,username);
    }catch (e){
        res.status(400).json({    
        error: 
        "Error creating user. Please try a unique email and username."});
    }
})
// list all users
router.get('/',async(req,res)=>{
    const allusers = await prisma.user.findMany({select:{id:true,name:true,image:true,tweets:{select:{id:true,content:true,image:true, impression:true}}}});
    res.json(allusers);
})

//get one user
router.get('/:id',async(req,res)=>{
    const {id}= req.params;
    const user = await prisma.user.findUnique({
        where: {id:Number(id)},
        include:{tweets:true}
    })
    res.json(user);
})
//update user
router.put('/:id',async(req,res)=>{
    const {id}= req.params;
    const {bio, name, image}= req.body;
    try{
        const result = await prisma.user.update({
            where: {id: Number(id)},
            data: {bio, name, image},
        });
        res.json(result);
    }catch (e){
        res.status(400).json({error: "Error updating user details"});
    }
    
})
//delete user
router.delete('/:id',async(req,res)=>{
    const {id}= req.params;
    await prisma.user.delete({where: {id: Number(id)}})
    res.sendStatus(200);
})

export default router;