const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require("../ModelsSchema/userModel");
const path = require('path');
const fs = require('fs');


// Handle user registration
const userRegister = async (req, res) => {
    try {
        const { name, age, gender, dob, address, email, phNum, voterId, aadhar, vote, photo } = req.body;

        // Check if all required fields are provided
        if (!name || !age || !gender || !dob || !address || !email || !phNum || !voterId || !aadhar || !photo) {
            return res.status(400).send("All fields are required");
        }

        // Check if user already exists
        const user = await User.findOne({ email, voterId, aadhar });
        if (user) {
            return res.status(400).send("User already exists");
        }

        // Create new user and store the face descriptor for later comparison
        const newUser = await User.create({
            name,
            age,
            gender,
            dob,
            address,
            email,
            phNum,
            voterId,
            aadhar,
            photo, // Save only the file name
            vote,
        });

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(400).send("Error occurred during registration");
    }
};

const userLogin = asyncHandler ( async(req,res) => {

    try {
        const {voterId,aadhar,otp} = req.body;

        if(!voterId || !aadhar || !otp){
            res.status(400);
            throw new Error("All fields are not empty")
        }

        const user = await User.findOne({voterId,aadhar});

        if(user){
            const accessToken = jwt.sign(
            {
                user : {
                    voterId
                }
            },
            process.env.SECRET_PASSWORD_USER,
            {expiresIn : "1d"}
        )

        return res.status(201).json({accessToken,voterId});
        }else{
            return res.status(400).json({message : "Wrong voter Id / aadhar"})
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({message : "Something went wrong"});
    }
})


const getUserImagePath = asyncHandler (async (req,res)=>{

    try {
        const id = req.params.id;

    const userPicture = await User.findOne({voterId:id})
    if(userPicture){
        let fetchedPicture = userPicture.photo;
        const imagePath = path.join(__dirname, '..', '..', 'client', 'public', fetchedPicture); 
        // console.log(imagePath)
        res.status(201).sendFile(imagePath);
    }
    } catch (error) {
        console.log(error);
    }
    
})


const userVoteDetails = asyncHandler( async (req,res)=>{

    try {
    const { voterId } = req.body;

    const checkVoterId = await User.findOne({ voterId });

    if (!checkVoterId) {
        return res.status(404).json({ message: "User not found" });
    }

    checkVoterId.vote += 1;

    await checkVoterId.save();

    return res.status(200).json({
        userVotedDetails : checkVoterId,
        message: "Vote count updated successfully",
        vote: checkVoterId.vote
    });

    } catch (error) {
        console.log(error);
    }


})

const getUserMlaVoteDetails = asyncHandler( async(req,res)=>{
    try {
        const userVoterId = req.params.id;

        if(!userVoterId){
            return res.status(400).send("User VoterId Not Found");
        }else{
            const finduser = await User.findOne({voterId:userVoterId });

            if(finduser.vote === 0){
                return res.status(201).send({message : "You can put vote",vote: finduser.vote});
            }else{
                return res.status(400).send("User already put his vote to candidate");
            }
        }

    } catch (error) {
        console.log(error);
    }
})


const getUserMpVoteDetails = asyncHandler( async(req,res)=>{
    try {
        const userVoterId = req.params.id;

        if(!userVoterId){
            return res.status(400).send("User VoterId Not Found");
        }else{
            const finduser = await User.findOne({voterId:userVoterId });

            if(finduser.vote === 1){
                return res.status(201).send({message : "You can put vote",vote: finduser.vote});
            }else{
                return res.status(400).send("User already put his vote to candidate");
            }
        }

    } catch (error) {
        console.log(error);
    }
})

module.exports = {userRegister,userLogin,getUserImagePath,userVoteDetails,getUserMlaVoteDetails,getUserMpVoteDetails};