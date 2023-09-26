import { useEffect, useState } from 'react';
import './SportTypes.scss';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useFetchWithAuthorization from '../../useFetchWithAuthorization';
import SportTypeForm from '../../components/Admin/SportTypeForm';
import SportTypeBlock from '../../components/Admin/SportTypeBlock';

export default function SportTypes() {
  const [listOfSportTypes, setListOfSportTypes] = useState('');
  const fetchWithAuthorization = useFetchWithAuthorization();
  const deleteIcon = <FontAwesomeIcon icon={faTrashCan} />;
  const [errorMessage, setErrorMessage] = useState('');

  async function getListOfSportTypes() {
    try {
      const response = await fetchWithAuthorization(
        `${process.env.REACT_APP_API_BASE_URL}/api/sports`,
      );
      const data = await response.json();
      setListOfSportTypes(data.sportTypes);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Hiba történt az adatok betöltése során');
    }
  }

  useEffect(() => {
    getListOfSportTypes();
  }, []);

  async function handleClickOnDelete(id) {
    let response;

    try {
      response = await fetchWithAuthorization(`${process.env.REACT_APP_API_BASE_URL}/api/admin/sports/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (response?.ok) {
        getListOfSportTypes();
      } else {
        setErrorMessage(id);
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      }
    } catch (err) {
      setErrorMessage('Sikertelen törlés');
    }
  }

  return (
    <main className="container mt-3 px-2 pb-5">
      <div className="dataFrame">
        <h1 className="pageTitle pt-3">Sport/edzés típusok</h1>
        {!errorMessage
          ? (
            <div className="mt-2 px-3">

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary my-3 ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Új típus hozzáadása
                </button>
              </div>
              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-fullscreen-sm-down">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                      <SportTypeForm getListOfSportTypes={getListOfSportTypes} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          : <div className="fs-6 my-4">{errorMessage}</div>}
        {listOfSportTypes
          && (
            <div className="sportTypeList d-lg-flex justify-content-md-evenly mt-3">
              {(listOfSportTypes.find((sportType) => sportType.hasPropDistance && !sportType.hasPropExercises))
                && (
                  <SportTypeBlock
                    title="Megadható a távolság"
                    listOfSportTypes={listOfSportTypes}
                    handleClickOnDelete={handleClickOnDelete}
                    deleteIcon={deleteIcon}
                    hasPropDistance
                    hasPropExercises={false}
                    showOther={false}
                  />
                )}
              {(listOfSportTypes.find((sportType) => !sportType.hasPropDistance && sportType.hasPropExercises))
                && (
                  <SportTypeBlock
                    title="Megadhatóak a gyakorlatok"
                    listOfSportTypes={listOfSportTypes}
                    handleClickOnDelete={handleClickOnDelete}
                    deleteIcon={deleteIcon}
                    hasPropDistance={false}
                    hasPropExercises
                    showOther={false}
                  />
                )}
              {(listOfSportTypes.find((sportType) => ((!sportType.hasPropDistance && !sportType.hasPropExercises)
                || (sportType.hasPropDistance && sportType.hasPropExercises))))
                && (
                  <SportTypeBlock
                    title="Egyéb sportok (megadható mindkettő vagy egyik sem)"
                    listOfSportTypes={listOfSportTypes}
                    handleClickOnDelete={handleClickOnDelete}
                    deleteIcon={deleteIcon}
                    hasPropDistance
                    hasPropExercises
                    showOther
                  />
                )}
            </div>
          )}
        {listOfSportTypes?.length === 0
          && !errorMessage
          && <div className="fs-6 my-4">Nem található hozzáadott sport típus</div>}
      </div>
    </main>
  );
}
