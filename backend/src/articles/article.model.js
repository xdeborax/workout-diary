import mongoose from 'mongoose';

const articleSchema = mongoose.Schema({
  category: String,
  description: String,
  title: String,
  content: String,
  publish_date: {
    type: Date,
    default: () => Date.now(),
  },
});

export const ArticleModel = mongoose.model('Article', articleSchema);
