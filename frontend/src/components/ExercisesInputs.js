import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ExercisesInputs({
  exercisesInputsRows, setExercisesInputsRows, generateRandomId,
}) {
  const deleteIcon = <FontAwesomeIcon icon={faTrashCan} />;
  const exercisesLabels = ['weight', 'sets', 'reps'];

  function handleInputChange({ target: { name, value } }, index) {
    const data = [...exercisesInputsRows];
    data[index][name] = value;
    setExercisesInputsRows(data);
  }

  function addRow() {
    const newRowId = generateRandomId();
    const object = {
      id: newRowId, exerciseName: '', weight: '', sets: '', reps: '',
    };

    setExercisesInputsRows([...exercisesInputsRows, object]);
  }

  function removeRow(index) {
    const data = [...exercisesInputsRows];
    data.splice(index, 1);
    setExercisesInputsRows(data);
  }

  return (

    <div className="strengthFormTable table-responsive mt-2 mb-4">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Gyakorlat:</th>
            <th scope="col">Súly (kg)</th>
            <th scope="col">Kör</th>
            <th scope="col">Ismétlés</th>
          </tr>
        </thead>
        <tbody>
          {exercisesInputsRows?.map((row, index) => {
            return (
              <tr key={row.id}>
                <td className="px-0">
                  <input
                    name="exerciseName"
                    data-testid="exerciseName-input"
                    className="form-control exerciseNameInput input-field"
                    type="text"
                    onChange={(event) => handleInputChange(event, index)}
                    value={row.exerciseName}
                  />
                </td>
                {exercisesLabels.map((label) => {
                  return (
                    <td key={label} className="ps-1 pe-0">
                      <input
                        name={label}
                        data-testid={`${label}-input`}
                        className="form-control exerciseNumberInput input-field"
                        type="number"
                        onChange={(event) => handleInputChange(event, index)}
                        value={row[label]}
                      />
                    </td>
                  );
                })}
                <td className="px-0">
                  <button
                    type="button"
                    data-testid="delete-row"
                    className="btn text-danger text-center"
                    onClick={() => removeRow(index)}
                  >
                    <i className="fa-lg">{deleteIcon}</i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button type="button" className="btn btn-primary text-light mb-2" onClick={addRow}>+ Új sor</button>
    </div>
  );
}
