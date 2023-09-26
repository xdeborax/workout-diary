export default function SportTypeBlock({
  title, listOfSportTypes, handleClickOnDelete, deleteIcon, hasPropDistance, hasPropExercises, showOther,
}) {
  return (
    <div className="sportTypeBlock mb-3 mx-2">
      <div className="mb-2">{title}</div>
      <ul className="list-group">
        {showOther && listOfSportTypes.map((sportType) => {
          if ((!sportType.hasPropDistance && !sportType.hasPropExercises)
          || (sportType.hasPropDistance && sportType.hasPropExercises)) {
            return (
              <li key={sportType.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>{sportType.type}</div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger text-light text-center"
                      id={`deleteSporType-${sportType.id}`}
                      onClick={() => handleClickOnDelete(sportType.id)}
                    >
                      {deleteIcon}
                    </button>
                  </div>
                </div>
              </li>
            );
          }
          return null;
        })}
        {!showOther && listOfSportTypes.map((sportType) => {
          if (sportType.hasPropDistance === hasPropDistance && sportType.hasPropExercises === hasPropExercises) {
            return (
              <li key={sportType.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>{sportType.type}</div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger text-light text-center"
                      id={`deleteSporType-${sportType.id}`}
                      onClick={() => handleClickOnDelete(sportType.id)}
                    >
                      {deleteIcon}
                    </button>
                  </div>
                </div>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
