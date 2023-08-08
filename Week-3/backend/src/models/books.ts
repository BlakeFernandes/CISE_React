import mongoose, { Schema, Document } from 'mongoose';

interface IBook extends Document {
  title: string;
  isbn: string;
  author: string;
  description?: string;
  published_date?: Date;
  publisher?: string;
  updated_date?: Date;
}

const BookSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  published_date: {
    type: Date
  },
  publisher: {
    type: String
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IBook>('Book', BookSchema);
