export default (indicators => {
  return JSON.stringify(indicators.map(([iClass, iArgs, iColors]) => [iClass.id, iArgs, iColors]));
});