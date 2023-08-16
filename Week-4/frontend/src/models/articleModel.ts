import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    authors: string;
    source?: string;
    pubyear?: string;
    doi?: string;
    claim?: string;
    evidence?: string;
}

const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: false
  },
  pubyear: {
    type: String,
    required: false
  },
  doi: {
    type: String,
    required: false
  },
  claim: {
    type: String,
    required: false
  },
  evidence: {
    type: String,
    required: false
  }
});

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
