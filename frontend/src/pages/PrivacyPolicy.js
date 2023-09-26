import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <div className="row dataFrame mt-5">
        <div className="col-12 mt-3">
          <h1 className="mb-5 border-bottom border-primary">
            Adatvédelmi szabályzat
          </h1>
          <p>...</p>
          <Link data-testid="backToHomePage" className="btn btn-m btn-primary my-3" to="/">Ugrás a főoldalra</Link>
        </div>
      </div>
    </div>
  );
}
