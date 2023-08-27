import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema(
  {
    userEmail: {
        type: String,
        required: true,
    },
    feedbackId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VoteModel = mongoose.models.VoteModel || mongoose.model("VoteModel", voteSchema);
export default VoteModel;