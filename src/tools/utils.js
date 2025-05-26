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

export function debounce(func, delay = 1000) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
