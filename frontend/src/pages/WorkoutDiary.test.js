import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { UserContext } from '../contexts/UserContext';

const workouts = {
  workouts: [
    {
      sportType: 'Futás',
      duration: 1,
      distance: 5,
      date: new Date(),
      durationUnit: 'óra',
      distanceUnit: 'km',
      isDone: true,
      exercises: [],
      id: '6433d73f7e910b05ebd1e23e',
    },
    {
      sportType: 'Biciklizés',
      duration: 1,
      date: new Date('2023-04-01'),
      durationUnit: 'óra',
      isDone: true,
      exercises: [],
      id: '6433d73f7e910b05ebd1e235',
    },
    {
      sportType: 'Erősítő edzés',
      date: '2023-03-24',
      duration: 1,
      durationUnit: 'óra',
      exercises: [
        {
          exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, id: '643465cb38091b644d96d4c8',
        },
      ],
      isDone: true,
      id: '6433d73f7e910b05ebd1e23c',
    },
  ],
};

const sportTypeSelectValues = {
  sportTypes: [
    {
      type: 'Futás',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Biciklizés',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Erősítő edzés',
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

describe('Workout diary page render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('If I navigate to /diary as a logged in user, the workot form get rendered on screen', async () => {
    const loggedInUser = { name: 'John Doe' };

    render(
      <UserContext.Provider value={{ loggedInUser }}>
        <MemoryRouter initialEntries={['/diary']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
    const titleElement = screen.getAllByText('Edzésnapló')[1];
    expect(titleElement).toBeInTheDocument();
  });

  test('The page should contain title "Edzésnapló" and the correct tabs', async () => {
    const loggedInUser = { name: 'John Doe' };

    render(
      <UserContext.Provider value={{ loggedInUser }}>
        <MemoryRouter initialEntries={['/diary']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );

    const pageTitle = screen.getByRole('heading', { name: 'Edzésnapló' });
    const tabTitle = screen.getByRole('tab', { name: 'Mai edzés' });
    const tabTitleSecond = screen.getByRole('tab', { name: 'E heti edzések' });
    const tabTitleThird = screen.getByRole('tab', { name: 'Összes edzés' });
    expect(pageTitle).toBeInTheDocument();
    expect(tabTitle).toBeInTheDocument();
    expect(tabTitleSecond).toBeInTheDocument();
    expect(tabTitleThird).toBeInTheDocument();
  });

  test('If I navigate to /diary without login, the workout form should not be rendered', async () => {
    render(
      <UserContext.Provider value={{ loggedInUser: null }}>
        <MemoryRouter initialEntries={['/diary']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
    const titleElement = screen.queryByText('Edzésnapló');
    expect(titleElement).not.toBeInTheDocument();
  });
});

describe('Workout diary contains the user\'s workouts', () => {
  let workoutsFetch;
  beforeEach(() => {
    workoutsFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(workouts),
    });

    render(
      <UserContext.Provider value={{ loggedInUser: { name: 'John Doe' }, tokenInContext: 'ab.cd.ef.' }}>
        <MemoryRouter initialEntries={['/diary']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Fetch request is called with the right params to get user\'s workout diary', async () => {
    expect(workoutsFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/diaries`, {
      headers: {
        Authorization: 'Bearer ab.cd.ef.',
      },
    });
  });

  test('After a get fetch, the page should contain the correct workouts under "Összes edzés" tab', async () => {
    fireEvent.click(screen.getByRole('tab', { name: 'Összes edzés' }));
    fireEvent.click(screen.getByTestId('list-radio'));

    await waitFor(() => {
      expect(screen.getAllByText('Futás')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Biciklizés')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Erősítő edzés')[0]).toBeInTheDocument();
    });
  });

  test('After a get fetch, the page should contain the correct workouts under "Mai edzés" tab', async () => {
    fireEvent.click(screen.getByRole('tab', { name: 'Mai edzés' }));

    await waitFor(() => {
      expect(screen.getAllByText('Futás')[0]).toBeInTheDocument();
    });
  });

  test('After a get fetch, the page should contain the correct workouts under "E heti edzések" tab', async () => {
    fireEvent.click(screen.getByRole('tab', { name: 'E heti edzések' }));
    await waitFor(() => {
      expect(screen.getAllByText('Futás')[0]).toBeInTheDocument();
    });
  });

  test('After click on the workout accordion, the details are shown', async () => {
    fireEvent.click(screen.getByRole('tab', { name: 'Összes edzés' }));
    fireEvent.click(screen.getByTestId('list-radio'));
    fireEvent.click(screen.getByRole('button', { name: /Futás/i }));
    fireEvent.click(screen.getByRole('button', { name: /Biciklizés/i }));
    fireEvent.click(screen.getByRole('button', { name: /Erősítő edzés/i }));

    await waitFor(() => {
      expect(screen.getAllByText('1 óra')).toHaveLength(3);
      expect(screen.getAllByText('5 km')[0]).toBeInTheDocument();
      expect(screen.getByText('guggolás')).toBeInTheDocument();
      expect(screen.getByText('Gyakorlat')).toBeInTheDocument();
      expect(screen.getByText('Súly (kg)')).toBeInTheDocument();
      expect(screen.getByText('Kör')).toBeInTheDocument();
      expect(screen.getByText('Ismétlés')).toBeInTheDocument();
    });
  });

  test('After click on one of the workouts remove button, the fetch is called with the right params', async () => {
    fireEvent.click(screen.getByRole('tab', { name: 'Összes edzés' }));
    fireEvent.click(screen.getByTestId('list-radio'));
    fireEvent.click(screen.getByRole('button', { name: /Futás/i }));
    fireEvent.click(screen.getAllByTestId('delete-workout')[0]);

    await waitFor(() => {
      expect(workoutsFetch).toHaveBeenLastCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/diaries`, {
        method: 'PATCH',
        body: JSON.stringify({ workoutId: workouts.workouts[0].id }),
        headers: {
          Authorization: 'Bearer ab.cd.ef.',
          'Content-type': 'application/json',
        },
      });
    });
  });

  test('After click on one of the workouts modify button, the modify form apperas', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(sportTypeSelectValues),
    });
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(units),
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Összes edzés' }));
    fireEvent.click(screen.getByTestId('list-radio'));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Biciklizés/i }));
      fireEvent.click(screen.getAllByTestId('modify-workout')[0]);
      expect(screen.getByText('Edzés módosítása')).toBeInTheDocument();

      expect(screen.getByLabelText(/Edzés elnevezése/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Dátum/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Időtartam/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Távolság/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Megjegyzés/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Megcsináltam/i)).toBeInTheDocument();
    });
  });
});
