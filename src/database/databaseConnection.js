const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGO_CONNECTION_URL)
    .then(()=> console.log('DataBase connected successfull'))
    .catch(err => console.log(err));
}

module.exports = connectDB