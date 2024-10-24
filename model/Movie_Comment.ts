import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface สำหรับ Movie_Comment
export interface IMovieComment extends Document {
  movie_id: number;
  user_id: mongoose.Types.ObjectId; // ใช้ ObjectId แทน email เพื่อเชื่อมโยงกับ User
  message: string;
  timestamp: Date;
}

// สร้าง Schema สำหรับ Movie_Comment
const MovieCommentSchema: Schema = new Schema({
  movie_id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId
    ref: 'User', // อ้างอิงถึงโมเดล User
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// สร้างโมเดล
const MovieComment: Model<IMovieComment> = mongoose.models.MovieComment || mongoose.model<IMovieComment>('MovieComment', MovieCommentSchema);

export default MovieComment;
