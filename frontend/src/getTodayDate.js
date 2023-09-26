export default function getTodayDate() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let firstDayOfCurrentWeek;
  let lastDayOfCurrentWeek;
  if (today.getDay() === 0) {
    firstDayOfCurrentWeek = new Date(today.setDate(today.getDate() - today.getDay() - 6));
    today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDayOfCurrentWeek = new Date(today.setDate(today.getDate() + 1));
  } else {
    firstDayOfCurrentWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDayOfCurrentWeek = new Date(today.setDate(today.getDate() - today.getDay() + 8));
  }

  today = new Date();

  const result = {
    fullDate: today.toISOString().slice(0, 10).replaceAll('-', '.'),
    day: today.getDate(),
    weekDay: today.getDay(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    firstDayOfCurrentWeek,
    lastDayOfCurrentWeek,
  };
  return result;
}
