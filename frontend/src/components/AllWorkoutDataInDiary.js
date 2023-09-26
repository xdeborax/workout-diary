import { useEffect, useState } from 'react';
import WorkoutElement from './WorkoutElement';
import PieChart from './PieChart';

export default function AllWorkoutDataInDiary({
  allWorkoutsData,
  handleClickOnDelete,
  handleClickOnModify,
  todayDate,
  hideFormHandler,
}) {
  const [filteredWorkoutsData, setFilteredWorkoutsData] = useState(allWorkoutsData);
  const [listOfSportTypes, setListOfSportTypes] = useState([]);
  const [sportTypeFilter, setSportTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    setFilteredWorkoutsData(allWorkoutsData);
    getSportTypes();
    filterWorkoutsData(sportTypeFilter, dateFilter);
  }, [allWorkoutsData]);

  function handleSelectChange({ target: { value } }) {
    setSportTypeFilter(value);
    filterWorkoutsData(value, dateFilter);
  }

  function handleDateSelectChange({ target: { value } }) {
    setDateFilter(value);
    filterWorkoutsData(sportTypeFilter, value);
  }

  function filterWorkoutsData(filterSPortType, filterDate) {
    hideFormHandler();
    let updatedDataBySportType = {};
    if (filterSPortType === '') {
      updatedDataBySportType = allWorkoutsData;
    } else {
      Object.keys(allWorkoutsData).forEach((date) => {
        const updatedWorkoutList = allWorkoutsData[date].workouts.filter((workout) => {
          return workout.sportType === filterSPortType;
        });
        if (updatedWorkoutList.length > 0) {
          updatedDataBySportType[date] = {};
          updatedDataBySportType[date].date = allWorkoutsData[date].date;
          updatedDataBySportType[date].workouts = updatedWorkoutList;
        }
      });
    }

    setFilteredWorkoutsData(updatedDataBySportType);

    if (filterDate) {
      const updatedDataByDate = {};
      Object.keys(updatedDataBySportType).forEach((date) => {
        if (date.slice(0, 4) === filterDate.slice(0, 4)
          && date.slice(5, 7) === filterDate.slice(5, 7)) {
          updatedDataByDate[date] = updatedDataBySportType[date];
        }
      });
      setFilteredWorkoutsData(updatedDataByDate);
    }
  }

  function getSportTypes() {
    const listOfSportTypesValues = [];
    Object.keys(allWorkoutsData).forEach((date) => {
      allWorkoutsData[date].workouts.forEach((workout) => {
        if (!listOfSportTypesValues.includes(workout.sportType)) {
          listOfSportTypesValues.push(workout.sportType);
        }
      });
    });
    setListOfSportTypes(listOfSportTypesValues);
  }

  return (
    <>
      <div className="d-flex justify-content-end align-items-center mt-3">

        <form className="d-flex align-items-center mb-3" onSubmit={filterWorkoutsData}>
          <div className="mx-2 my-auto text-center col-auto">
            {`${Object.keys(filteredWorkoutsData).length} találat`}
          </div>
          <select
            className="form-select input-field me-2"
            onChange={handleSelectChange}
          >
            <option value="">Válassz sport típust</option>
            {listOfSportTypes && listOfSportTypes.map((value) => {
              return <option key={value}>{value}</option>;
            })}
          </select>

          <input
            type="month"
            id="start"
            name="start"
            className="form-control form-label input-field m-0"
            onChange={handleDateSelectChange}
          />
        </form>
      </div>
      {Object.keys(filteredWorkoutsData).length > 1 && dateFilter && !sportTypeFilter
        && <PieChart filteredWorkoutsData={filteredWorkoutsData} />}
      <div>
        {filteredWorkoutsData && Object.keys(filteredWorkoutsData).map((date) => {
          if (filteredWorkoutsData[date].workouts) {
            return (
              <WorkoutElement
                key={date}
                details={filteredWorkoutsData[date].workouts}
                workoutDate={filteredWorkoutsData[date].date}
                todayDate={todayDate}
                handleClickOnDelete={handleClickOnDelete}
                handleClickOnModify={handleClickOnModify}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
}
