import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm';

function MockRegisterForm() {
  return (
    <BrowserRouter>
      <RegisterForm />
    </BrowserRouter>
  );
}

describe('Form checks', () => {
  describe('Heading', () => {
    it('Form has a heading', async () => {
      render(
        <MockRegisterForm />,
      );
      const headingElement = screen.getByRole(/heading/i);
      expect(headingElement).toBeInTheDocument();
    });
  });

  describe('Name input field', () => {
    it('Name input field exists', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Felhasználónév*/i);
      expect(inputElement).toBeInTheDocument();
    });

    it('Should be able to type in name input', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Felhasználónév*/i);
      fireEvent.change(inputElement, { target: { value: 'John Doe' } });
      expect(inputElement.value).toBe('John Doe');
    });

    it('Should get an error when name input is empty and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Felhasználónév*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      expect(inputElement).toHaveClass('is-invalid');
    });

    it('Should get an errormessage when name input is empty and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Felhasználónév*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/A név megadása kötelező./i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Email input field', () => {
    it('Email input field exists', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      expect(inputElement).toBeInTheDocument();
    });

    it('Should be able to type in email input', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      fireEvent.change(inputElement, { target: { value: 'test@test.com' } });
      expect(inputElement.value).toBe('test@test.com');
    });

    it('Should get an error when email input is empty and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      expect(inputElement).toHaveClass('is-invalid');
    });

    it('Should get an errormessage when email input is empty and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/Az email megadása kötelező./i);
      expect(errorMessage).toBeInTheDocument();
    });
    it('Should get an errormessage when email input does not have a valid email format and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Email*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(inputElement, { target: { value: 'fea.fa@' } });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/Nem megfelelő email formátum./i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Password input field', () => {
    it('Password input field exists', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      expect(inputElement).toBeInTheDocument();
    });

    it('Should be able to type in password input', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      fireEvent.change(inputElement, { target: { value: '********' } });
      expect(inputElement.value).toBe('********');
    });

    it('Should get an error when password input is empty and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      expect(inputElement).toHaveClass('is-invalid');
    });

    it('Should get an errormessage when password input is empty and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/A jelszó megadása kötelező./i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('Should get an errormessage when password input has at least 1 but less than 8 characters and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const inputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(inputElement, { target: { value: '*' } });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/A jelszónak legalább 8 karakternek kell lennie./i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Checkbox', () => {
    it('Checkbox exists', async () => {
      render(
        <MockRegisterForm />,
      );
      const checkboxElement = screen.getByText(/Elfogadom*/i);
      expect(checkboxElement).toBeInTheDocument();
    });

    it('Checkbox works if it is not checked', async () => {
      render(
        <MockRegisterForm />,
      );
      const checkboxElement = screen.getByText(/Elfogadom*/i);
      fireEvent.change(checkboxElement, { target: { checked: false } });
      expect(checkboxElement).not.toBeChecked();
    });

    it('Checkbox works if it is checked', async () => {
      render(
        <MockRegisterForm />,
      );
      const checkboxElement = screen.getByLabelText(/Elfogadom*/i);
      fireEvent.change(checkboxElement, { target: { checked: true } });
      expect(checkboxElement).toBeChecked();
    });

    it('Should get an error when checkbox is not checked and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const checkboxElement = screen.getByLabelText(/Elfogadom*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });

      fireEvent.change(checkboxElement, { checked: false });
      fireEvent.click(buttonElement);
      expect(checkboxElement).toHaveClass('is-invalid');
    });

    it('Should get an errormessage when checkbox is not checked and button is clicked', async () => {
      render(
        <MockRegisterForm />,
      );
      const checkboxElement = screen.getByText(/Elfogadom*/i);
      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      fireEvent.change(checkboxElement, { checked: false });
      fireEvent.click(buttonElement);
      const errorMessage = screen.getByText(/Kötelező elfogadni./i);
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
      render(<MockRegisterForm />);

      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      const nameInputElement = screen.getByPlaceholderText(/Felhasználónév*/i);
      const emailInputElement = screen.getByPlaceholderText(/Email*/i);
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const checkboxElement = screen.getByText(/Elfogadom*/i);

      fireEvent.change(nameInputElement, { target: { value: 'John Doe' } });
      fireEvent.change(emailInputElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInputElement, { target: { value: 'abcdefgh' } });
      fireEvent.click(checkboxElement, { checked: true });
      fireEvent.click(buttonElement);

      expect(fetchSpy).toHaveBeenCalled();
    });
    it('If fetching was not called', async () => {
      render(<MockRegisterForm />);

      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      const nameInputElement = screen.getByPlaceholderText(/Felhasználónév*/i);
      const emailInputElement = screen.getByPlaceholderText(/Email*/i);
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const checkboxElement = screen.getByText(/Elfogadom*/i);

      fireEvent.change(nameInputElement, { target: { value: '' } });
      fireEvent.change(emailInputElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInputElement, { target: { value: 'abcdefgh' } });
      fireEvent.click(checkboxElement, { checked: true });
      fireEvent.click(buttonElement);

      expect(fetchSpy).not.toHaveBeenCalled();
    });
    it('If fetching was called with the right params', async () => {
      render(<MockRegisterForm />);

      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      const nameInputElement = screen.getByPlaceholderText(/Felhasználónév*/i);
      const emailInputElement = screen.getByPlaceholderText(/Email*/i);
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const checkboxElement = screen.getByText(/Elfogadom*/i);

      fireEvent.change(nameInputElement, { target: { value: 'John Doe' } });
      fireEvent.change(emailInputElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInputElement, { target: { value: 'abcdefgh' } });
      fireEvent.click(checkboxElement, { checked: true });
      fireEvent.click(buttonElement);

      expect(fetchSpy).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/register`, {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@test.com',
          password: 'abcdefgh',
        }),
        headers: {
          'Content-type': 'application/json',
        },

      });
    });
    it('Response.ok than my input fields are empty after button clicked', async () => {
      render(<MockRegisterForm />);

      const buttonElement = screen.getByRole('button', { name: /Regisztráció/i });
      const nameInputElement = screen.getByPlaceholderText(/Felhasználónév*/i);
      const emailInputElement = screen.getByPlaceholderText(/Email*/i);
      const passwordInputElement = screen.getByPlaceholderText(/Jelszó*/i);
      const checkboxElement = screen.getByText(/Elfogadom*/i);

      fireEvent.change(nameInputElement, { target: { value: 'John' } });
      fireEvent.change(emailInputElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInputElement, { target: { value: '*********' } });
      fireEvent.click(checkboxElement, { checked: true });
      fireEvent.click(buttonElement);

      await waitFor(() => {
        expect(nameInputElement.value).toBe('');
        expect(emailInputElement.value).toBe('');
        expect(passwordInputElement.value).toBe('');
        expect(checkboxElement).not.toBeChecked();
      });
    });
  });
});
