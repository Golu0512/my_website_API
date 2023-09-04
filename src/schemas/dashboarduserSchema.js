const mongoose = require('mongoose');

const adminusersSchema = mongoose.Schema({
user_name: String,
email: String,
password: String,
role: String
});

module.exports = adminusersSchema;