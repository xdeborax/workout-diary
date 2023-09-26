import { articleService } from './article.service';

export const articleController = {
  async get(req, res, next) {
    try {
      const articleList = await articleService.getArticles();
      const result = { articles: articleList };
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
