import { Link } from 'react-router-dom';

export default function NotAdmin() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center mt-5">
          <h2>
            Sajnáljuk, de nincs megfelelő jogosultságod az oldal megtekintéséhez.
          </h2>
          <p className="my-4">Itt jutsz vissza a főoldalra:</p>
          <Link
            data-testid="backToHomePage"
            className="btn btn-m btn-primary me-2"
            to="/"
          >
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </div>
  );
}
