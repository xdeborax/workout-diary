import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useMemo } from 'react';
import ProfileForm from './ProfileForm';
import { UserContext } from '../contexts/UserContext';

function MockProfileForm() {
  const loggedInUser = useMemo(() => ({
    name: 'John Doe', email: 'john@doe.com', password: '123456789', userId: '987654321',
  }), []);
  const logInUserByToken = useMemo(() => jest.fn(), []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserContext.Provider value={{ loggedInUser, logInUserByToken }}>
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

describe('Form checks', () => {
  describe('Heading', () => {
    it('Form has the proper heading', async () => {
      render(
        <MockProfileForm />,
      );
      const headingElement = screen.getByRole('heading', { name: 'Profil módosítása' });
      expect(headingElement).toBeInTheDocument();
    });
  });

  describe('Name input field', () => {
    it('Name input field exists', async () => {
      render(
        <MockProfileForm />,
      );
      const inputElement = screen.queryByDisplayValue('John Doe');
      expect(inputElement).toBeInTheDocument();
    });

    it('Should be able to type in name input', async () => {
      render(
        <MockProfileForm />,
      );
      const inputElement = screen.queryByDisplayValue('John Doe');
      fireEvent.change(inputElement, { target: { value: 'John Doe Little' } });
      expect(inputElement.value).toBe('John Doe Little');
    });
  });

  describe('Email input field', () => {
    it('Email input field exists', async () => {
      render(
        <MockProfileForm />,
      );
      const inputElement = screen.queryByDisplayValue('john@doe.com');
      expect(inputElement).toBeInTheDocument();
    });

    it('Should not be able to type in email input because it is disabled', async () => {
      render(
        <MockProfileForm />,
      );
      const inputElement = screen.queryByDisplayValue('john@doe.com');
      expect(inputElement).toBeDisabled();
    });
  });

  describe('Password input field', () => {
    it('Password input field exists', async () => {
      render(
        <MockProfileForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      expect(inputElement).toBeInTheDocument();
    });

    it('Should be able to type in password input', async () => {
      render(
        <MockProfileForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      fireEvent.change(inputElement, { target: { value: '********' } });
      expect(inputElement.value).toBe('********');
    });
  });

  describe('FETCH', () => {
    let fetchSpy;

    beforeEach(() => {
      const mockToken = 'fakeToken';
      localStorage.setItem('token', mockToken);
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('If fetch was called with the right params', async () => {
      fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      });
      render(<MockProfileForm />);

      const buttonElement = screen.getByRole('button', { name: /Módosítás/i });
      const nameInputElement = screen.queryByDisplayValue('John Doe');
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);

      fireEvent.change(nameInputElement, { target: { value: 'John Doe Junior' } });
      fireEvent.change(passwordInputElement, { target: { value: '123456789test' } });
      fireEvent.click(buttonElement);

      expect(fetchSpy).toHaveBeenCalled();
      expect(fetchSpy).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/users`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'John Doe Junior',
          password: '123456789test',
        }),
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer fakeToken',
        },

      });
    });
    it('If fetch was successful then my input fields are updated with the updated user data', async () => {
      fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          name: 'John Doe Junior',
          email: 'john@doe.com',
          password: 'abcdefghijk',
          token: 'newToken',
        }),
        ok: true,
      });

      render(<MockProfileForm />);

      const buttonElement = screen.getByRole('button', { name: /Módosítás/i });
      const nameInputElement = screen.queryByDisplayValue('John Doe');
      const emailInputElement = screen.queryByDisplayValue('john@doe.com');
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);

      fireEvent.change(nameInputElement, { target: { value: 'John Doe Junior' } });
      fireEvent.change(passwordInputElement, { target: { value: '123456789test' } });
      fireEvent.click(buttonElement);

      await waitFor(() => {
        const newToken = 'newToken';
        localStorage.setItem('token', newToken);
        expect(screen.getByText('Sikerült a módosítás')).toBeInTheDocument();
        expect(nameInputElement).toHaveValue('John Doe Junior');
        expect(emailInputElement).toHaveValue('john@doe.com');
        expect(passwordInputElement).toHaveValue('');
      });
    });
    it('If fetch was unsuccessful I get back an error message from backend and name and password input fields are empty', async () => {
      fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: 'Hibaüzenet a backendről.',
        }),
        status: 400,
      });

      render(<MockProfileForm />);

      const buttonElement = screen.getByRole('button', { name: /Módosítás/i });
      const nameInputElement = screen.queryByDisplayValue('John Doe');
      const emailInputElement = screen.queryByDisplayValue('john@doe.com');
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);

      fireEvent.change(nameInputElement, { target: { value: '' } });
      fireEvent.change(passwordInputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(screen.getByText('Hibaüzenet a backendről.')).toBeInTheDocument();
        expect(nameInputElement).toHaveValue('');
        expect(emailInputElement).toHaveValue('john@doe.com');
        expect(passwordInputElement).toHaveValue('');
      });
    });
  });
});
