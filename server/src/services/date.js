const checkNumber = number => number < 10 ? `0${ number }` : number;

const getDate = (days = 0) => {
  const currentDate = new Date();
  const date = new Date(currentDate.setDate(currentDate.getDate() + days));

  return `${ checkNumber(date.getDate()) }.${ checkNumber(date.getMonth() + 1) }.${ date.getFullYear() }`;
};

module.exports = { getDate };
