const express = require('express')
const router = express.Router()
const axios=require('axios')
const User=require('../models/User')
const Post=require('../models/Posts')
const { authorize } = require('../utils')

router.post('/new',authorize,async(req,res)=>{
    const {title,text,dogId}=req.body
    if(!title || !text || !dogId )
        return res.status(400).jsonp({message:"incomeplete input"})
    const userId=res.user.userId
    const newPost= new Post({
        title,text,dogId,userId
    })
    const createdPost=await newPost.save()
    res.status(200).json(createdPost)
})

router.post('/newAdopt',authorize,async(req,res)=>{
    const {title,text,dogId}=req.body
    const isAdoption=true
    if(!title || !text || !dogId )
        return res.status(400).jsonp({message:"incomeplete input"})
    const userId=res.user.userId
    const newPost= new Post({
        title,text,isAdoption,dogId,userId
    })
    const createdPost=await newPost.save()
    res.status(200).json(createdPost)
})

router.get('/user/:id',async(req,res)=>{
    const userId=req.params.id
    const user=await User.findById(userId)
    if(!user) return res.status(400).json({ error: 'Could not find user' })
    const result= await Post.find({userId})
    if (!result || result.length === 0) {
        return res.status(404).json({ message: 'No Posts for this user.' });
    }
    res.status(200).json(result);
    })
module.exports = router