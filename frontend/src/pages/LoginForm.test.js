import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import UserContextProvider from '../contexts/UserContext';

function MockLoginForm() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </UserContextProvider>
  );
}

describe('Form checks', () => {
  describe('Heading', () => {
    it('Form has a heading', async () => {
      render(
        <MockLoginForm />,
      );
      const headingElement = screen.getByRole(/heading/i);
      expect(headingElement).toBeInTheDocument();
    });
  });

  describe('Email input field', () => {
    it('Email input field exists', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      expect(inputElement).toBeInTheDocument();
    });

    it('Should be able to type in email input', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      fireEvent.change(inputElement, { target: { value: 'test@test.com' } });
      expect(inputElement.value).toBe('test@test.com');
    });

    it('Should get an error when email input is empty and button is clicked', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      expect(inputElement).toHaveClass('is-invalid');
    });

    it('Should get an errormessage when email input is empty and button is clicked', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/Az email megadása kötelező./i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('Should get an errormessage when email input does not have a valid email format and button is clicked', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      fireEvent.change(inputElement, { target: { value: 'fea.fa@' } });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/Nem megfelelő email formátum./i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Password input field', () => {
    it('Password input field exists', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      expect(inputElement).toBeInTheDocument();
    });

    it('Should be able to type in password input', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      fireEvent.change(inputElement, { target: { value: '********' } });
      expect(inputElement.value).toBe('********');
    });

    it('Should get an error when password input is empty and button is clicked', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      expect(inputElement).toHaveClass('is-invalid');
    });

    it('Should get an errormessage when password input is empty and button is clicked', async () => {
      render(
        <MockLoginForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/A jelszó megadása kötelező./i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('FETCH', () => {
    let fetchSpy;

    beforeEach(() => {
      fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      });
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('If fetching was called', async () => {
      render(<MockLoginForm />);

      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      const emailInputElement = screen.getByPlaceholderText(/Email*/i);
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);

      fireEvent.change(emailInputElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInputElement, { target: { value: 'abcdefgh' } });
      fireEvent.click(buttonElement);

      expect(fetchSpy).toHaveBeenCalled();
    });
    it('If fetching was not called', async () => {
      render(<MockLoginForm />);

      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      const emailInputElement = screen.getByPlaceholderText(/Email*/i);
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);

      fireEvent.change(emailInputElement, { target: { value: '' } });
      fireEvent.change(passwordInputElement, { target: { value: 'abcdefgh' } });
      fireEvent.click(buttonElement);

      expect(fetchSpy).not.toHaveBeenCalled();
    });
    it('If fetching was called with the right params', async () => {
      render(<MockLoginForm />);

      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      const emailInputElement = screen.getByPlaceholderText(/Email*/i);
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);

      fireEvent.change(emailInputElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInputElement, { target: { value: 'abcdefgh' } });
      fireEvent.click(buttonElement);

      expect(fetchSpy).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'abcdefgh',
        }),
        headers: {
          'Content-type': 'application/json',
        },

      });
    });
    it('Response.ok than my input fields are empty after button clicked', async () => {
      render(<MockLoginForm />);

      const buttonElement = screen.getByRole('button', { name: /Bejelentkezés/i });
      const emailInputElement = screen.getByPlaceholderText(/Email*/i);
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);

      fireEvent.change(emailInputElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInputElement, { target: { value: '*********' } });
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(emailInputElement.value).toBe('');
        expect(passwordInputElement.value).toBe('');
      });
    });
  });
});
