import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';

function MockNotFound() {
  return (
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>
  );
}

describe('Not Found Component', () => {
  it('When click on the back to home pgae button I will be rendered to Home page via / route', async () => {
    render(
      <MockNotFound />,
    );
    const linkElement = screen.getByTestId('backToHomePage');
    linkElement.dispatchEvent(new MouseEvent('click'));
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
