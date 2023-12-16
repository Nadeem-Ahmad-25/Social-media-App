import { Router } from "express";
const router= Router();

router.post('/',(req,res)=>{
    res.status(501).json({error:'Not implemented:'});
})
// list all users
router.get('/',(req,res)=>{
    res.status(501).json({error:'Not implemented:'});
})

//get one user
router.get('/:id',(req,res)=>{
    const {id}= req.params;
    res.status(501).json({error:`Not implemented:${id}`});
})
//update user
router.put('/:id',(req,res)=>{
    const {id}= req.params;
    res.status(501).json({error:'Not implemented:'});
})
//delete user
router.delete('/:id',(req,res)=>{
    const {id}= req.params;
    res.status(501).json({error:'Not implemented:'});
})

export default router;