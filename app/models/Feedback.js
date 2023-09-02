// import { Schema, model, models } from "mongoose";

// const feedbackSchema = new Schema({
//         title: { 
//             type: String, 
//             required: true 
//         },
//         description: { 
//             type: String, 
//             required: true 
//         },
//     }, 
//     {
//         timestamps: true,
//     }
// )

// export const FeedbackModel = models?.FeedbackModel || model('FeedbackModel', feedbackSchema)


import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    images: {
        type: [String],
    },
    userEmail: {
      type: String,
      required: true,
  },
  },
  {
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
  }
);

feedbackSchema.virtual('user', {
  ref: 'User',
  localField: 'userEmail',
  foreignField: 'email',
  justOne: true
})

const FeedbackModel = mongoose.models.FeedbackModel || mongoose.model("FeedbackModel", feedbackSchema);
export default FeedbackModel;