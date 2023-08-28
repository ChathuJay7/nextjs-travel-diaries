import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    userEmail: {
        type: String,
        required: true,
    },
    feedbackId: {
        type: mongoose.Types.ObjectId,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.models.CommentModel || mongoose.model("CommentModel", commentSchema);
export default CommentModel;