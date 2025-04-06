import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    profile_pic: {
        type: String,
        default: function() {
            return `https://ui-avatars.com/api/?name=${this.first_name}+${this.last_name}&background=539BF5&color=fff`;
        }
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: 'user'
    }
});

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;