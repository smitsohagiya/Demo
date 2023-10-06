// var mongoose = require('mongoose');
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true
    },
    email: {
      type: String,
      // required: true
    },
    user_password: {
      type: String,
      default: ""
    },
    forget_password_token: {
      type: String,
      default: ""
    },
    token: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    is_deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);
export default User