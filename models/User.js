import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
name: {
    type: String,
},
email: {
    type: String
},
password: {
    type: String,
},
isAdmin: {
    type: Boolean,
    default: false,
},
},
{ timestamps: true }
);

export default mongoose.model('User', userSchema);