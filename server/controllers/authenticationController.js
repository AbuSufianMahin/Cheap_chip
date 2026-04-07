const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

const registerWithCredentials = async (req, res) => {
    try{
        console.log(req.body)
    }catch(error){

    }
}

module.exports = {registerWithCredentials}