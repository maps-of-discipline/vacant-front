import config from '../config';

export default function getCurrentSemester(currentDate = new Date()) {
  const year = currentDate.getFullYear();

  if (currentDate < config.semester1Start) {
    return { semester: 2, year: year - 1 };
  } else if (currentDate < config.semester2Start) {
    return { semester: 1, year: year };
  } else {
    return { semester: 2, year: year };
  }
}
