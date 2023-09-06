const mongoose = require('mongoose');

const userrequirementSchema = mongoose.Schema({
    movie_name: String,
    email: String,
    mobile_number: String
});

module.exports = userrequirementSchema;