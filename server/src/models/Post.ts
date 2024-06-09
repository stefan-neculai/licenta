import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the author's reference
interface IAuthor {
    userId: mongoose.Types.ObjectId;
    username: string;
    profilePic?: string;  // Marked as optional
}

// Define the main interface for the Post document
interface IPost extends Document {
  author: IAuthor;
  content: string;
  community: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
  likedBy: mongoose.Types.ObjectId[]; // Array of user IDs who have liked the post
}

// Create the schema using the defined interfaces
const postSchema = new Schema<IPost>({
  author: {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    username: { type: String, required: true }
  },
  community: { type: Schema.Types.ObjectId, required: true, ref: 'Community' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }] // References to users who have liked the post
});

// Create the model from the schema
const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
