import Articles from '../components/Articles';
import './Home.scss';
import '../components/Header.scss';

export default function Home() {
  return (
    <>
      <div>
        <div className="homeText fw-bold text-center">
          <div>
            <div>
              Naplózd edzéseidet!
            </div>
          </div>
        </div>
      </div>
      <div className="articlePageOnHome pb-5">
        <div className="container">
          <Articles showOnlySixArticles />
        </div>
      </div>
    </>
  );
}
