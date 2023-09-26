import '@testing-library/jest-dom';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { UserContext } from '../contexts/UserContext';

describe('Header conditional render', () => {
  test('Header for visitors renders "login" and "register" buttons', () => {
    const loggedInUser = null;
    render(
      <UserContext.Provider value={{ loggedInUser }}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </UserContext.Provider>,
    );
    expect(screen.queryByRole('link', { name: 'Bejelentkezés' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Regisztráció' })).toBeInTheDocument();
  });

  test('Header for logged in users renders "adding workout", "workout diary", "profil and "logout" buttons', () => {
    const loggedInUser = { name: 'John Doe' };
    render(
      <UserContext.Provider value={{ loggedInUser }}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </UserContext.Provider>,
    );
    expect(screen.queryByRole('link', { name: 'Edzés hozzáadása' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Edzésnapló' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Profil' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Kijelentkezés' })).toBeInTheDocument();
  });

  describe('Logout', () => {
    it('If there is a loggedinuser, button is visible', async () => {
      const loggedInUser = { name: 'John Doe' };
      render(
        <UserContext.Provider value={{ loggedInUser }}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </UserContext.Provider>,
      );
      expect(screen.queryByRole('link', { name: 'Kijelentkezés' })).toBeInTheDocument();
    });

    it('If there is no loggedinuser, button is not visible', async () => {
      const loggedInUser = null;
      render(
        <UserContext.Provider value={{ loggedInUser }}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </UserContext.Provider>,
      );
      expect(screen.queryByRole('link', { name: 'Kijelentkezés' })).not.toBeInTheDocument();
    });

    it('If logout button has clicked it navigates to Home via / route', async () => {
      const loggedInUser = { name: 'John Doe' };
      render(
        <UserContext.Provider value={{ loggedInUser }}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </UserContext.Provider>,
      );
      const buttonElement = screen.getByText(/Kijelentkezés/i);
      buttonElement.dispatchEvent(new MouseEvent('click'));
      await waitFor(() => {
        expect(window.location.pathname).toBe('/');
      });
    });

    it('If logout button has clicked the logout function will be called', async () => {
      const loggedInUser = { name: 'John Doe' };
      const logOutUser = jest.fn();
      render(
        <UserContext.Provider value={{ loggedInUser, logOutUser }}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </UserContext.Provider>,
      );
      const buttonElement = screen.getByText(/Kijelentkezés/i);
      fireEvent.click(buttonElement);
      await waitFor(() => {
        expect(logOutUser).toHaveBeenCalled();
      });
    });
  });
});
