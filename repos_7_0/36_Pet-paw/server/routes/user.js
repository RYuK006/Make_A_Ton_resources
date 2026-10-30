const express = require('express')
const { authorize } = require('../utils')
const router = express.Router()
const User=require('../models/User')
const Following=require('../models/Following')

router.get('/', authorize, (req,res) => {
    res.status(200).json(res.user)
})

router.patch('/completeprofile/:id',authorize,async(req,res)=>{
    const { name, phone, email, address, category,bio} = req.body;

    const user = await User.findById(req.params.id);

    if (user) {
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.email = email || user.email;
        user.category = category || user.category;
        user.bio = bio || user.bio;
        user.address = address || user.addresss;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

router.post('/follow/:userId',authorize,async(req,res)=>{
    if(req.params.userId==res.user.userId) return res.status(400).json({ message: "Invalid request" });

    const user = await User.findById(req.params.userId)
    .catch(err => res.status(400).json(err))
    if(!user) return res.status(404).json({ message: "User not found" });

    Following.create({ selfId: res.user.userId, userId: user._id})
    .then(() => {
        res.status(201).json({ message: "Followed succesfully" })
    })
    .catch((err) => {
        if(err.code===11000) return res.status(400).json({ message: "Duplicate follow", err })
        res.status(400).json(err)

    })
})

router.post('/unfollow/:userId',authorize,async(req,res)=>{
    const user = await User.findById(req.params.userId)
    if(!user) return res.status(404).json({ message: "User not found" })
        
    Following.deleteOne({ selfId: res.user.userId, userId: user._id})
    .then((result) => {
        if(result.deletedCount===1) res.status(201).json({ message: "Unfollowed succesfully" });
        else res.status(201).json({ message: "User not included in following list" })
    })
    .catch(err => res.status(500).json(err))
})

router.get('/following/:userId', async (req,res) => {
    const user = await User.findById(req.params.userId)
    if(!user) return res.status(404).json({ message: "User not found" })

    await Following.find().where('selfId').equals(user._id).select('userId')
    .populate('userId')
    .then(result => res.status(200).json(result.map(data => {
        return { id: data.userId._id, username: data.userId.username, name: data.userId.name }
    })))
    .catch(err => res.status(500).json(err))
})

router.get('/followers/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    try {
        const followings = await Following.find({ userId }).select('selfId');
        const selfIds = followings.map(following => following.selfId);
        
        const followers = await User.find({ _id: { $in: selfIds } }).select('username name _id');

        return res.status(200).json(followers);
    } catch (err) {
        return res.status(400).json(err);
    }
});
module.exports = router