import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center mt-5">
          <h1>
            Hoppá! A keresett oldal nem található.
          </h1>
          <p className="my-4">Itt jutsz vissza a főoldalra:</p>
          <Link data-testid="backToHomePage" className="btn btn-m btn-primary me-2" to="/">Vissza a főoldalra</Link>
        </div>
      </div>
    </div>
  );
}
