const mongoose = require("mongoose");


const ConnectDb = async () =>{
    try {
        const connection = await mongoose.connect(process.env.CONNECTION_URL,
            {   
                serverSelectionTimeoutMS: 5000
            }
        );
        console.log(`Host-Name : ${connection.connection.host} & Db-Name : ${connection.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = ConnectDb