import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ArcElement,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

export default function PieChart({ filteredWorkoutsData }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  );

  const [pieChartData, setPieChartData] = useState({});

  function getDataForPieChart() {
    const result = {};
    Object.values(filteredWorkoutsData).forEach((filteredWorkoutData) => {
      filteredWorkoutData.workouts.forEach((workout) => {
        if (result[workout.sportType]) {
          result[workout.sportType] += 1;
        } else {
          result[workout.sportType] = 1;
        }
      });
    });
    setPieChartData(result);
  }

  useEffect(() => {
    getDataForPieChart();
  }, [filteredWorkoutsData]);

  const dataForPie = {
    labels: Object.keys(pieChartData),
    datasets: [
      {
        label: 'edzések száma',
        data: Object.values(pieChartData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {Object.keys(pieChartData).length > 0
        && (
        <div className="container p-5 pieChart">
          <div className="mb-2">Edzéseid aránya:</div>
          <Pie data={dataForPie} />
        </div>
        )}
    </div>
  );
}
