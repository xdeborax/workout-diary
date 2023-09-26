import { useEffect, useState } from 'react';
import './Articles.scss';
import { NavLink } from 'react-router-dom';

export default function Articles({ showOnlySixArticles }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [listOfCategories, setListOfCategories] = useState([]);
  const [error, setError] = useState(null);

  async function getArticles() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/articles`,
      );
      const data = await response.json();
      if (showOnlySixArticles) {
        data.articles.length = 6;
      }
      setArticles(data.articles);
      setFilteredArticles(data.articles);

      const listOfCategoriesResult = [];
      data.articles.forEach((article) => {
        if (!listOfCategoriesResult.includes(article.category)) {
          listOfCategoriesResult.push(article.category);
        }
      });
      setListOfCategories(listOfCategoriesResult);
    } catch (err) {
      setError(
        'Hiba történt a cikkek betöltése során!',
      );
    }
  }

  useEffect(() => {
    getArticles();
  }, []);

  function handleSelectChange({ target: { value } }) {
    if (value === '') {
      setFilteredArticles(articles);
    } else {
      const filteredArticleList = articles.filter((article) => article.category === value);
      setFilteredArticles(filteredArticleList);
    }
  }

  return (
    <div className="container-fluid dataFrame mt-5 p-1 p-sm-2 p-md-3">
      <h1 className="pageTitle fs-4 pt-3">Mozgással & egészséges életmóddal kapcsolatos cikkek:</h1>
      {!showOnlySixArticles
        && (
          <form className="d-flex align-items-center mb-3 col-sm-7 col-md-4 article-select">
            <select
              className="form-select input-field me-2 mt-4"
              onChange={handleSelectChange}
            >
              <option value="">Válassz kategóriát...</option>
              {listOfCategories && listOfCategories.map((value) => {
                return <option key={value}>{value}</option>;
              })}
            </select>
          </form>
        )}
      <div className="articles">
        {error ? (
          <div className="my-3">{error}</div>
        ) : articles.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 gy-4 article-element">
            {filteredArticles.map((article) => (
              <div key={article.id}>
                <div>
                  <div>
                    <div className="row g-0
                  border
                  rounded
                  overflow-hidden
                  flex-md-row
                  mb-4
                  shadow-sm h-md-250 position-relative"
                    >
                      <div className="col p-4 d-flex flex-column position-static card-body">
                        <strong className="d-inline-block mb-2 text-primary">{article.category}</strong>
                        <h3 className="mb-0 fw-bold">{article.title}</h3>
                        <div className="mb-1 text-body-secondary my-2">
                          {new Date(article.publish_date).toISOString().slice(0, 10).replaceAll('-', '.')}
                        </div>
                        <p className="card-text mb-auto">
                          {article.description}
                        </p>
                        <p>
                          <button
                            className="btn btn-primary mt-3"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapseWidthExample${article.id}`}
                            aria-expanded="false"
                            aria-controls={`collapseWidthExample${article.id}`}
                          >
                            Tovább olvasom
                          </button>
                        </p>
                        <div>
                          <div className="collapse" id={`collapseWidthExample${article.id}`}>
                            <div className="mb-3 text-break">
                              {article.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {showOnlySixArticles
              && (
              <NavLink to="/articles">
                <button className="btn btn-primary ms-4 mb-3" type="button">
                  Még több cikk érdekel
                </button>
              </NavLink>
              )}
          </div>

        ) : (
          <p>Nincsenek cikkeink</p>
        )}
      </div>
    </div>
  );
}
