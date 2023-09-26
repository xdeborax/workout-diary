import { ArticleModel } from './article.model';

export const articleService = {
  async getArticles() {
    const articleList = await ArticleModel.find({});
    const result = articleList.map((article) => ({
      id: article._id,
      category: article.category,
      description: article.description,
      title: article.title,
      content: article.content,
      publish_date: article.publish_date,
    }));
    return result;
  },
};
