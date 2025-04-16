const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true, 'Name should be exist'],
    },
    age : {
        type : String,
        required : [true, 'Age should be exist'],
    },
    gender : {
        type : String,
        required : [true, 'Gender should be exist'],
    },
    dob : {
        type : String,
        required : [true, 'Dob should be exist'],
    },
    address : {
        type : String,
        required : [true, 'Address should be exist'],
    },
    email : {
        type : String,
        required : [true, 'Email should be exist'],
    },
    phNum : {
        type : String,
        required : [true, 'Phone No should be exist'],
    },
    voterId : {
        type : String,
        required : [true, 'Voter Id should be exist'],
    },
    aadhar : {
        type : String,
        required : [true, 'Aadhar should be exist'],
    },
    photo : {
        type : String,
        required : [true, 'Photo should be exist'],
    },
    vote : {
        type : Number,
        required : [true, 'Vote should be exist'],
    },
},
{
    timestamps : true
}
);

const model = mongoose.model("User",userSchema);
module.exports = model;