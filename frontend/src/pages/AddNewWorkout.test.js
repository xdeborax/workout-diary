import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { UserContext } from '../contexts/UserContext';

const sportTypeSelectValues = {
  sportTypes: [
    {
      type: 'futás',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'fitness',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'egyéb',
      hasPropDistance: true,
      hasPropExercises: true,
    },
  ],
};

const units = {
  units: [
    { unitName: 'időtartam', unitValue: ['perc', 'óra'] },
    { unitName: 'távolság', unitValue: ['m', 'km'] },
  ],
};

describe('Add new workout page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('If I navigate to /workout as a logged in user, the workout form get rendered on screen', async () => {
    const loggedInUser = { name: 'John Doe' };

    render(
      <UserContext.Provider value={{ loggedInUser }}>
        <MemoryRouter initialEntries={['/workout']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
    const titleElement = screen.getAllByText('Edzés hozzáadása')[1];
    expect(titleElement).toBeInTheDocument();
  });

  test('If I navigate to /workout without login, the workout form should not be rendered', async () => {
    render(
      <UserContext.Provider value={{ loggedInUser: null }}>
        <MemoryRouter initialEntries={['/workout']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
    const titleElement = screen.queryByText('Edzés hozzáadása');
    expect(titleElement).not.toBeInTheDocument();
  });
});

describe('Workout form', () => {
  let sportTypeFetch;
  let unitFetch;
  beforeEach(() => {
    sportTypeFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(sportTypeSelectValues),
    });
    unitFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(units),
    });

    render(
      <UserContext.Provider value={{ loggedInUser: { name: 'John Doe' }, tokenInContext: 'ab.cd.ef.' }}>
        <MemoryRouter initialEntries={['/workout']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Form has a heading', async () => {
    const headingElement = screen.getByRole(/heading/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('Fetch requests are called with the right params to get sport types and units', async () => {
    expect(sportTypeFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/sports`, {
      headers: {
        Authorization: 'Bearer ab.cd.ef.',
      },
    });
    expect(unitFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/units`, {
      headers: {
        Authorization: 'Bearer ab.cd.ef.',
      },
    });
  });

  test('Select contains the fetched values as options and default option "Válassz..." is selected', async () => {
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(4);
      expect(screen.getByRole('option', { name: 'Válassz...' }).selected).toBe(true);
      expect(screen.getAllByRole('option')[1].value).toBe('futás');
      expect(screen.getAllByRole('option')[2].value).toBe('fitness');
      expect(screen.getAllByRole('option')[3].value).toBe('egyéb');
    });
  });

  test('Before select an option "Mentés" button is disabled', async () => {
    await waitFor(() => {
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toBeDisabled();
    });
  });

  test('After select an option "Mentés" button is no more disabled', async () => {
    await waitFor(() => {
      screen.getByRole('option', { name: 'futás' });
      const inputElement = screen.getByLabelText(/Sport típusa:*/i);
      fireEvent.change(inputElement, { target: { value: 'futás' } });
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).not.toBeDisabled();
    });
  });

  test('After select an option, basic form inputs and the proper variable inputs are shown (hasPropDistance)', async () => {
    await waitFor(() => {
      const optionOne = screen.getByRole('option', { name: 'futás' });
      expect(optionOne).toBeInTheDocument();

      const inputElement = screen.getByLabelText(/Sport típusa:*/i);
      fireEvent.change(inputElement, { target: { value: 'futás' } });
      expect(inputElement.value).toBe('futás');

      expect(screen.getByLabelText(/Edzés elnevezése/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Dátum/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Időtartam/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Távolság/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Megjegyzés/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Megcsináltam/i)).toBeInTheDocument();
      expect(screen.getByText(/perc/i)).toBeInTheDocument();
      expect(screen.getByText(/óra/i)).toBeInTheDocument();
      expect(screen.getByText('m')).toBeInTheDocument();
      expect(screen.getByText(/km/i)).toBeInTheDocument();
    });
  });

  test('After select an option, basic form inputs and the proper variable inputs are shown (hasPropExercises)', async () => {
    await waitFor(() => {
      const optionOne = screen.getByRole('option', { name: 'fitness' });
      expect(optionOne).toBeInTheDocument();

      const inputElement = screen.getByLabelText(/Sport típusa:*/i);
      fireEvent.change(inputElement, { target: { value: 'fitness' } });
      expect(inputElement.value).toBe('fitness');

      expect(screen.getByLabelText(/Edzés elnevezése./i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Dátum/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Időtartam/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Megjegyzés/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Megcsináltam/i)).toBeInTheDocument();
      expect(screen.getByText(/perc/i)).toBeInTheDocument();
      expect(screen.getByText(/óra/i)).toBeInTheDocument();
      expect(screen.getByText(/Gyakorlatok:/i)).toBeInTheDocument();
      expect(screen.getByText(/Súly*/i)).toBeInTheDocument();
      expect(screen.getByText(/Kör*/i)).toBeInTheDocument();
      expect(screen.getByText(/Ismétlés*/i)).toBeInTheDocument();
      expect(screen.getByText(/Új sor*/i)).toBeInTheDocument();
    });
  });

  describe('Check inputs', () => {
    beforeEach(async () => {
      await waitFor(() => {
        screen.getByRole('option', { name: 'egyéb' });
        const inputElement = screen.getByLabelText(/Sport típusa:*/i);
        fireEvent.change(inputElement, { target: { value: 'egyéb' } });
      });
    });

    test('Should be able to type in workout name input', async () => {
      const inputElement = screen.getByLabelText(/Edzés elnevezése*/i);
      fireEvent.change(inputElement, { target: { value: 'délutáni mozgás' } });
      expect(inputElement.value).toBe('délutáni mozgás');
    });

    test('Should be able to pick a date', async () => {
      const inputElement = screen.getByLabelText(/Dátum*/i);
      fireEvent.change(inputElement, { target: { value: '2023-03-31' } });
      expect(inputElement.value).toBe('2023-03-31');
    });

    test('Should get an error when date is not picked and button is clicked', async () => {
      const inputElement = screen.getByLabelText(/Dátum*/i);
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      expect(inputElement).toHaveClass('input-field form-control is-invalid');
    });

    test('Should be able to type in the duration input', async () => {
      const inputElement = screen.getByLabelText(/Időtartam*/i);
      fireEvent.change(inputElement, { target: { value: 2 } });
      expect(inputElement.value).toBe('2');
    });

    test('Should get an error when duration is 0 or less than 0 and button is clicked', async () => {
      const inputElement = screen.getByLabelText(/Időtartam*/i);
      fireEvent.change(inputElement, { target: { value: -2 } });
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.click(buttonElement);
      expect(screen.getByText(/Nem lehet nulla vagy annál kisebb!*/i)).toBeInTheDocument();
    });

    test('Should get an error when duration input is empty and button is clicked', async () => {
      const inputElement = screen.getByLabelText(/Időtartam*/i);
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.click(buttonElement);
      expect(inputElement).toHaveClass('input-field form-control is-invalid');
    });

    test('Should "perc" duration unit be checked and "óra" not to be checked by default', async () => {
      const radioElementChecked = screen.getByLabelText(/perc*/i);
      const radioElementNotChecked = screen.getByLabelText(/óra*/i);
      expect(radioElementChecked).toBeChecked();
      expect(radioElementNotChecked).not.toBeChecked();
    });

    test('Should be able to type in the distance input', async () => {
      const inputElement = screen.getByLabelText(/Távolság*/i);
      fireEvent.change(inputElement, { target: { value: 2 } });
      expect(inputElement.value).toBe('2');
    });

    test('Should get an error when distance is 0 or less than 0 and button is clicked', async () => {
      const inputElement = screen.getByLabelText(/Távolság*/i);
      fireEvent.change(inputElement, { target: { value: -2 } });
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.click(buttonElement);
      expect(screen.getByText(/Nem lehet nulla vagy annál kisebb!*/i)).toBeInTheDocument();
    });

    test('Should "m" duration unit be checked and "km" not to be checked by default', async () => {
      const radioElementChecked = screen.getByLabelText('m');
      const radioElementNotChecked = screen.getByLabelText(/km*/i);
      expect(radioElementChecked).toBeChecked();
      expect(radioElementNotChecked).not.toBeChecked();
    });

    test('Should be able to type in exercise weight input', async () => {
      const inputElement = screen.getByTestId('weight-input');
      fireEvent.change(inputElement, { target: { value: 2 } });
      expect(inputElement.value).toBe('2');
    });

    test('Should get an error when weight is 0 or less than 0 and button is clicked', async () => {
      const inputElement = screen.getByTestId('weight-input');
      const exerciseNameInputElement = screen.getByTestId('exerciseName-input');
      fireEvent.change(inputElement, { target: { value: -2 } });
      fireEvent.change(exerciseNameInputElement, { target: { value: 'guggolás' } });
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.click(buttonElement);
      expect(screen.getByText(/Nem lehet nulla vagy annál kisebb értéket megadni!*/i)).toBeInTheDocument();
    });

    test('Should be able to type in exercise sets input', async () => {
      const inputElement = screen.getByTestId('sets-input');
      fireEvent.change(inputElement, { target: { value: 2 } });
      expect(inputElement.value).toBe('2');
    });

    test('Should get an error when sets is 0 or less than 0 and button is clicked', async () => {
      const inputElement = screen.getByTestId('sets-input');
      const exerciseNameInputElement = screen.getByTestId('exerciseName-input');
      fireEvent.change(inputElement, { target: { value: -2 } });
      fireEvent.change(exerciseNameInputElement, { target: { value: 'guggolás' } });
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.click(buttonElement);
      expect(screen.getByText(/Nem lehet nulla vagy annál kisebb értéket megadni!*/i)).toBeInTheDocument();
    });

    test('Should be able to type in exercise reps input', async () => {
      const inputElement = screen.getByTestId('reps-input');
      fireEvent.change(inputElement, { target: { value: 2 } });
      expect(inputElement.value).toBe('2');
    });

    test('Should get an error when reps is 0 or less than 0 and button is clicked', async () => {
      const inputElement = screen.getByTestId('reps-input');
      const exerciseNameInputElement = screen.getByTestId('exerciseName-input');
      fireEvent.change(inputElement, { target: { value: -2 } });
      fireEvent.change(exerciseNameInputElement, { target: { value: 'guggolás' } });
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.click(buttonElement);
      expect(screen.getByText(/Nem lehet nulla vagy annál kisebb értéket megadni!*/i)).toBeInTheDocument();
    });

    test('Should get an error when weight, sets or reps is added without exercise name and button is clicked', async () => {
      const weightInputElement = screen.getByTestId('weight-input');
      const setsInputElement = screen.getByTestId('sets-input');
      const repsInputElement = screen.getByTestId('reps-input');
      const exerciseNameInputElement = screen.getByTestId('exerciseName-input');

      fireEvent.change(weightInputElement, { target: { value: 2 } });
      fireEvent.change(setsInputElement, { target: { value: 2 } });
      fireEvent.change(repsInputElement, { target: { value: 2 } });
      fireEvent.change(exerciseNameInputElement, { target: { value: '' } });

      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.click(buttonElement);
      expect(screen.getByText(/Add meg a gyakorlat\/gyakorlatok nevét is.*/i)).toBeInTheDocument();
    });

    test('Should be able to to click "+ Új sor" button and a new row appears', async () => {
      const buttonElement = screen.getByRole('button', { name: /Új sor*/i });
      fireEvent.click(buttonElement);
      expect(screen.getAllByTestId('weight-input')).toHaveLength(2);
      expect(screen.getAllByTestId('sets-input')).toHaveLength(2);
      expect(screen.getAllByTestId('reps-input')).toHaveLength(2);
    });

    test('Should be able to to click delete button and the row disappears', async () => {
      const buttonElementToAddRow = screen.getByRole('button', { name: /Új sor*/i });
      fireEvent.click(buttonElementToAddRow);
      const buttonElementToRemoveRow = screen.getAllByTestId('delete-row')[0];
      fireEvent.click(buttonElementToRemoveRow);
      expect(screen.getAllByTestId('weight-input')).toHaveLength(1);
      expect(screen.getAllByTestId('sets-input')).toHaveLength(1);
      expect(screen.getAllByTestId('reps-input')).toHaveLength(1);
    });

    test('Should be able to type in the note input', async () => {
      const inputElement = screen.getByLabelText(/Megjegyzés*/i);
      fireEvent.change(inputElement, { target: { value: 'szuper' } });
      expect(inputElement.value).toBe('szuper');
    });

    test('Should get an error when note input is more than 200 characters', async () => {
      const inputElement = screen.getByLabelText(/Megjegyzés*/i);
      const buttonElement = screen.getByRole('button', { name: /Mentés/i });
      fireEvent.change(inputElement, { target: { value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' } });
      fireEvent.click(buttonElement);
      expect(inputElement).toHaveClass('input-field form-control is-invalid');
    });

    test('Checkbox works if it is not checked', async () => {
      const checkboxElement = screen.getByLabelText(/Megcsináltam*/i);
      fireEvent.change(checkboxElement, { target: { checked: false } });
      expect(checkboxElement).not.toBeChecked();
    });

    test('Checkbox works if it is checked', async () => {
      const checkboxElement = screen.getByLabelText(/Megcsináltam*/i);
      fireEvent.change(checkboxElement, { target: { checked: true } });
      expect(checkboxElement).toBeChecked();
    });

    describe('Post fetch', () => {
      let fetchSpy;
      beforeEach(() => {
        fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue({}),
          ok: true,
        });
      });

      test('If fetch was called with the right params', async () => {
        fireEvent.change(screen.getByLabelText(/Dátum/i), { target: { value: '2023-03-31' } });
        fireEvent.change(screen.getByLabelText(/Időtartam/i), { target: { value: 45 } });

        const buttonElement = screen.getByRole('button', { name: /Mentés/i });
        fireEvent.click(buttonElement);

        expect(fetchSpy).toHaveBeenCalledTimes(3);
        expect(fetchSpy).toHaveBeenLastCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/diaries`, {
          method: 'POST',
          body: JSON.stringify({
            sportType: 'egyéb',
            date: '2023-03-31',
            duration: 45,
            durationUnit: 'perc',
            isDone: false,
          }),
          headers: {
            Authorization: 'Bearer ab.cd.ef.',
            'Content-type': 'application/json',
          },
        });
      });

      test('If fetch was not called', async () => {
        fireEvent.change(screen.getByLabelText(/Dátum/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/Időtartam/i), { target: { value: 45 } });

        const buttonElement = screen.getByRole('button', { name: /Mentés/i });
        fireEvent.click(buttonElement);

        expect(fetchSpy).toHaveBeenCalledTimes(2);
      });

      test('if response.ok than inputs fields are hidden and button is again disabled', async () => {
        fireEvent.change(screen.getByLabelText(/Dátum/i), { target: { value: '2023-03-31' } });
        fireEvent.change(screen.getByLabelText(/Időtartam/i), { target: { value: 45 } });

        const buttonElement = screen.getByRole('button', { name: /Mentés/i });
        fireEvent.click(buttonElement);

        await waitFor(() => {
          expect(screen.queryByText(/Edzés elnevezése/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Dátum/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Időtartam/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Megjegyzés/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Megcsináltam/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/perc/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/óra/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Gyakorlatok:/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Súly*/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Kör*/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Ismétlés*/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/Új sor*/i)).not.toBeInTheDocument();
          expect(buttonElement).toBeDisabled();
        });
      });
    });
  });
});
