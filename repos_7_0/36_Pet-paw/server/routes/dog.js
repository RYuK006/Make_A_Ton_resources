const express = require('express')
const router = express.Router()
const axios=require('axios')
const User=require('../models/User')
const Dog=require('../models/Dogs')
const { authorize } = require('../utils')

router.post('/new',authorize,async(req,res)=>{
    const {name,breed,dob,bio}=req.body
    const userId=res.user.userId
    if(!name || !breed || !dob )
        return res.status(400).json({message:"incomplete input"})
    const response=await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`)
    image=response.data.message; 
    console.log(image)
    const newDog=new Dog({
        name,breed,dob,userId,image,bio
    })
    const createdDog=await newDog.save()
    res.status(200).json(createdDog)
})

router.get('/user/:id',async(req,res)=>{
    const userId=req.params.id
    const user=await User.findById(userId)
    if(!user) return res.status(400).json({ error: 'Could not find user' })
    const result= await Dog.find({userId})
    if (!result || result.length === 0) {
        return res.status(404).json({ message: 'No dogs for this user.' });
    }
    res.status(200).json(result);
    })

module.exports = router