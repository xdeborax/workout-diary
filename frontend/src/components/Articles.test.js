import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserContextProvider from '../contexts/UserContext';
import Articles from './Articles';

function MockArticles() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Articles />
      </BrowserRouter>
    </UserContextProvider>
  );
}

describe('Articles', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('If fetch was called', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    render(<MockArticles />);

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test('If articles are rendered to the screen', async () => {
    const fakeArticles = {
      articles: [
        {
          id: '63ea43d5125ae266b2bf6c97',
          category: 'Sport',
          description: 'First description',
          title: 'First article',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          publish_date: '2023-01-24T10:42:27.235Z',
        },
        {
          id: '63ea5bad5789737601e9ae47',
          category: 'Diet',
          description: 'First description',
          title: 'Second article',
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel ullam earum officiis numquam cumque natus?',
          publish_date: '2023-02-03T15:49:27.235Z',
        },
      ],
    };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
      json: jest.fn(() => fakeArticles),
    });

    render(<MockArticles />);

    expect(await screen.findByText('First article')).toBeInTheDocument();
    expect(await screen.findByText('Second article')).toBeInTheDocument();

    expect(
      await screen.findByText(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel ullam earum officiis numquam cumque natus?',
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText('Nincsenek cikkeink')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Hiba történt a cikkek betöltése során!',
      ),
    ).not.toBeInTheDocument();
  });

  test('If "Nincsenek cikkeink" is rendered if there are no articles', async () => {
    const fakeArticles = { articles: [] };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
      json: jest.fn(() => fakeArticles),
    });

    render(<MockArticles />);

    expect(await screen.findByText('Nincsenek cikkeink')).toBeInTheDocument();
    expect(
      await screen.queryByText(
        'Hiba történt a cikkek betöltése során!',
      ),
    ).not.toBeInTheDocument();
  });

  it('If the error is rendered to the screen if something went wrong', async () => {
    const fakeArticles = undefined;

    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
      json: jest.fn(() => fakeArticles),
    });

    render(<MockArticles />);

    expect(
      await screen.findByText(
        'Hiba történt a cikkek betöltése során!',
      ),
    ).toBeInTheDocument();

    expect(
      await screen.queryByText('Nincsenek cikkeink'),
    ).not.toBeInTheDocument();
  });
});
