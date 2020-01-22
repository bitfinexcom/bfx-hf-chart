export default (tick => {
  return +tick.toPrecision(8).toLocaleString('en-US', {
    maximumFractionDigits: 8
  });
});