import { articleService } from './article.service';
import { ArticleModel } from './article.model';

const articles = [
  {
    __v: 123,
    _id: '63ea43d5125ae266b2bf6c97',
    category: 'Sport',
    description: 'Some description',
    title: 'First article',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel ullam earum officiis numquam cumque natus? Id beatae rem magnam? Quaerat, sed voluptatem, distinctio ipsa odit rerum nisi soluta ab tempore dolorum officia unde? Nemo cum voluptatum harum repellat qui, fugiat vitae minus libero est minima. Recusandae dolorem fuga suscipit.',
    publish_date: '2023-01-24T10:42:27.235Z',
  },
  {
    __v: 524,
    _id: '63ea5bad5789737601e9ae47',
    category: 'Sport',
    description: 'Some description',
    title: 'Second article',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel ullam earum officiis numquam cumque natus? Id beatae rem magnam? Quaerat, sed voluptatem, distinctio ipsa odit rerum nisi soluta ab tempore dolorum officia unde? Nemo cum voluptatum harum repellat qui, fugiat vitae minus libero est minima. Recusandae dolorem fuga suscipit.',
    publish_date: '2023-02-03T15:49:27.235Z',
  },
];

const articleModelFind = jest.spyOn(ArticleModel, 'find');

describe('articleService', () => {
  beforeEach(() => {
    articleModelFind.mockReturnValue(articles);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const value = [
    {
      id: '63ea43d5125ae266b2bf6c97',
      category: 'Sport',
      description: 'Some description',
      title: 'First article',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel ullam earum officiis numquam cumque natus? Id beatae rem magnam? Quaerat, sed voluptatem, distinctio ipsa odit rerum nisi soluta ab tempore dolorum officia unde? Nemo cum voluptatum harum repellat qui, fugiat vitae minus libero est minima. Recusandae dolorem fuga suscipit.',
      publish_date: '2023-01-24T10:42:27.235Z',
    },
    {
      id: '63ea5bad5789737601e9ae47',
      category: 'Sport',
      description: 'Some description',
      title: 'Second article',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel ullam earum officiis numquam cumque natus? Id beatae rem magnam? Quaerat, sed voluptatem, distinctio ipsa odit rerum nisi soluta ab tempore dolorum officia unde? Nemo cum voluptatum harum repellat qui, fugiat vitae minus libero est minima. Recusandae dolorem fuga suscipit.',
      publish_date: '2023-02-03T15:49:27.235Z',
    },
  ];

  test('Should return all the articles found in the database', async () => {
    const result = await articleService.getArticles();
    expect(result).toEqual(value);
  });
});
