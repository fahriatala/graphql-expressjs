const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    },
    { timestamps: true }
);

userSchema.pre('save', async function() {
	this.password = await bcrypt.hashSync(this.password, saltRounds);
});


module.exports = mongoose.model('User', userSchema);