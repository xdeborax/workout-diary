import {
  render, screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { UserContext } from '../../contexts/UserContext';

describe('Admin route checking', () => {
  test('If I navigate to /admin/sports as without login, I get the NotFound error component', async () => {
    const loggedInUser = null;

    render(
      <UserContext.Provider value={{ loggedInUser }}>
        <MemoryRouter initialEntries={['/admin/sports']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
    const titleElement = screen.queryByText('Hoppá! A keresett oldal nem található.');
    expect(titleElement).toBeInTheDocument();
  });

  test('If I navigate to /admin/sports as logged in, but non admin user I get the NotAdmin error component', async () => {
    const loggedInUser = { name: 'John Doe' };

    render(
      <UserContext.Provider value={{ loggedInUser }}>
        <MemoryRouter initialEntries={['/admin/sports']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
    const titleElement = screen.queryByText('Sajnáljuk, de nincs megfelelő jogosultságod az oldal megtekintéséhez.');
    expect(titleElement).toBeInTheDocument();
  });

  test('If I navigate to /admin/sports as logged in admin, I get the sport types component', async () => {
    const loggedInUser = { name: 'John Doe', isAdmin: true };

    render(
      <UserContext.Provider value={{ loggedInUser }}>
        <MemoryRouter initialEntries={['/admin/sports']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
    const buttonElement = screen.getAllByText('Sport típusok')[0];
    expect(buttonElement).toBeInTheDocument();
  });
});
