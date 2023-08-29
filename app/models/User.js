// import mongoose, { Schema } from "mongoose";

// const userSchema = new Schema(
//   {
//     name: {
//         type: String,
//     },
//     email: {
//         type: String,
//     },
//     image: {
//         type: String
//     },
//     emailVerified: {
//         type: Date
//     }
//   },

// );

// const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
// export default UserModel;


import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        type: String
    },
    emailVerified: {
        type: Date
    }
  },

);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;