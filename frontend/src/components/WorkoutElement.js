import {
  faTrashCan, faPenToSquare, faCircleCheck, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function WorkoutList({
  details,
  todayDate,
  workoutDate,
  handleClickOnDelete,
  handleClickOnModify,
  expanded,
}) {
  const deleteIcon = <FontAwesomeIcon icon={faTrashCan} />;
  const editIcon = <FontAwesomeIcon icon={faPenToSquare} />;
  const checkIcon = <FontAwesomeIcon icon={faCircleCheck} />;
  const spinnerIcon = <FontAwesomeIcon icon={faSpinner} />;

  return (
    <div className="accordion" id="accordionFlushExample">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className={`accordion-button collapsed d-flex text-start
             ${todayDate.fullDate === workoutDate.fullDate
              && 'border border-primary rounded'}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#flush-collapse${details[0].id}`}
            aria-expanded="false"
            aria-controls={`flush-collapse${details[0].id}`}
          >
            <div className="fw-bold">
              {todayDate.year === workoutDate.year
                ? workoutDate.fullDate.slice(5)
                : workoutDate.fullDate}
            </div>
            <div className="ms-2">
              {workoutDate.dayName}
            </div>
            <div>
              {details.map((detail) => {
                return (
                  <em key={detail.id}>
                    <div className="fw-bold ms-2">
                      {detail.sportType}
                      <span className="ms-2">
                        {detail.isDone
                          ? <i className="text-success">{checkIcon}</i>
                          : <i className="text-secondary">{spinnerIcon}</i>}
                      </span>
                    </div>
                  </em>
                );
              })}
            </div>
          </button>
        </h2>
        <div
          id={`flush-collapse${details[0].id}`}
          className={`accordion-collapse collapse ${expanded && 'show'}`}
          data-bs-parent="#accordionFlushExample"
        >
          <div className="accordion-body">
            <ul className="list-group list-group-flush">
              {details.map((detail) => {
                return (
                  <li key={detail.id} className="list-group-item">
                    <div className="row">
                      <div className="col-12 col-sm-8">
                        <div className="row">
                          <div className="mt-2">
                            <div className="fw-bold mb-2">
                              {detail.sportType}
                              <span className="ms-2">
                                {detail.isDone
                                  ? <i className="text-success fa-lg">{checkIcon}</i>
                                  : <i className="text-secondary fa-lg">{spinnerIcon}</i>}
                              </span>
                              <span className="badge text-bg-light ms-2 fs-6">
                                {`${detail.duration} ${detail.durationUnit}`}
                              </span>
                              {detail.distance
                                && (
                                  <span className="badge text-bg-light ms-2 fs-6">
                                    {`${detail.distance} ${detail.distanceUnit}`}
                                  </span>
                                )}
                            </div>
                            <div className="row">
                              {detail.workoutName
                                && (
                                  <em className="me-2 my-2 col-12 col-md-auto">
                                    {`Megnevezés: ${detail.workoutName}`}
                                  </em>
                                )}
                            </div>
                          </div>
                        </div>
                        {Object.keys(detail.exercises).length > 0 && (
                          <div className="table-responsive">
                            <table className="table mt-2 table-sm table-hover table-bordered">
                              <thead className="table-light">
                                <tr>
                                  <th scope="col">Gyakorlat</th>
                                  {(detail.exercises.find((exercise) => exercise.weight))
                                    && <th scope="col">Súly (kg)</th>}
                                  {(detail.exercises.find((exercise) => exercise.sets))
                                    && <th scope="col">Kör</th>}
                                  {(detail.exercises.find((exercise) => exercise.reps))
                                    && <th scope="col">Ismétlés</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {detail.exercises.map((exercise) => {
                                  return (
                                    <tr key={exercise.id}>
                                      <th scope="row">{exercise.exerciseName}</th>
                                      {(detail.exercises.find((element) => element.weight)) && (exercise.weight
                                        ? (<td className="text-end">{exercise.weight}</td>)
                                        : <td className="text-end">-</td>)}
                                      {(detail.exercises.find((element) => element.sets)) && (exercise.sets
                                        ? (<td className="text-end">{exercise.sets}</td>)
                                        : <td className="text-end">-</td>)}
                                      {(detail.exercises.find((element) => element.reps)) && (exercise.reps
                                        ? (<td className="text-end">{exercise.reps}</td>)
                                        : <td className="text-end">-</td>)}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {detail.note
                          && (
                            <div className="mb-3">
                              <em>
                                Megjegyzés:
                                {' '}
                                {detail.note}
                              </em>
                            </div>
                          )}
                      </div>
                      <div className="col-sm-4 p-0 px-3 px-sm-0 text-end">
                        <button
                          type="button"
                          className="btn text-primary fs-4 text-center mx-1 my-1 deleteEditButton"
                          id={`modify-${detail.id}`}
                          data-testid="modify-workout"
                          onClick={() => handleClickOnModify(detail)}
                        >
                          <i>{editIcon}</i>
                        </button>
                        <button
                          type="button"
                          className="btn text-danger fs-4 text-center mx-1 my-1 deleteEditButton"
                          id={`delete-${detail.id}`}
                          data-testid="delete-workout"
                          onClick={() => handleClickOnDelete(detail.id)}
                        >
                          <i>{deleteIcon}</i>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
