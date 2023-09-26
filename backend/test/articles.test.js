import request from 'supertest';
import mongoose from 'mongoose';
import config from '../src/config';
import app from '../src/app';
import { ArticleModel } from '../src/articles/article.model';

const articles = [
  {
    category: 'Sport',
    description: 'Some description',
    title: 'First article',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel ullam earum officiis numquam cumque natus? Id beatae rem magnam? Quaerat, sed voluptatem, distinctio ipsa odit rerum nisi soluta ab tempore dolorum officia unde? Nemo cum voluptatum harum repellat qui, fugiat vitae minus libero est minima. Recusandae dolorem fuga suscipit.',
    publish_date: '2023-01-24T10:42:27.235Z',
  },
  {
    category: 'Sport',
    description: 'Some description',
    title: 'Second article',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel ullam earum officiis numquam cumque natus? Id beatae rem magnam? Quaerat, sed voluptatem, distinctio ipsa odit rerum nisi soluta ab tempore dolorum officia unde? Nemo cum voluptatum harum repellat qui, fugiat vitae minus libero est minima. Recusandae dolorem fuga suscipit.',
    publish_date: '2023-02-03T15:49:27.235Z',
  },
];

const DB_URI = `${config.testDb.uri}_articles`;

beforeAll(async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(DB_URI);
  await ArticleModel.create(articles[0]);
  await ArticleModel.create(articles[1]);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /api/articles', () => {
  test('should respond with 200 and return all the articles', async () => {
    const response = await request(app)
      .get('/api/articles')
      .set('Accept', 'application/json')
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(200);
    expect(response.body.articles[0].id).toBeTruthy();
    expect(response.body.articles[0].category).toBe(articles[0].category);
    expect(response.body.articles[0].description).toBe(articles[0].description);
    expect(response.body.articles[0].title).toBe(articles[0].title);
    expect(response.body.articles[0].content).toBe(articles[0].content);
    expect(response.body.articles[0].publish_date).toBe(
      articles[0].publish_date,
    );
    expect(response.body.articles[1].id).toBeTruthy();
    expect(response.body.articles[1].category).toBe(articles[1].category);
    expect(response.body.articles[1].description).toBe(articles[1].description);
    expect(response.body.articles[1].title).toBe(articles[1].title);
    expect(response.body.articles[1].content).toBe(articles[1].content);
    expect(response.body.articles[1].publish_date).toBe(
      articles[1].publish_date,
    );
  });
});
