import _max from 'lodash/max';
import _min from 'lodash/min';
/**
 * Returns a transformer object with methods to map X & Y coords to a certain
 * viewport.
 *
 * @param {number[]} data - complete dataset for min/max bounds
 * @param {number} vWidth - viewport width in pixels
 * @param {number} rightMTS - right-most timestamp
 * @return {Object} transformer
 */

export default function (data, vWidth, rightMTS) {
  const maxP = _max(data);

  const minP = _min(data);

  const pd = maxP - minP;
  let defaultTargetWidth;
  let defaultTargetHeight;

  let defaultYModifier = y => y;

  let defaultXModifier = x => x;

  const x = (dX, targetWidth = defaultTargetWidth) => {
    return defaultXModifier((vWidth - (rightMTS - dX)) / vWidth * targetWidth);
  };

  const y = (dY, targetHeight = defaultTargetHeight) => {
    return defaultYModifier((dY - minP) / pd * targetHeight);
  };

  const point = p => {
    return {
      x: x(p.mts),
      y: y(p.price)
    };
  };

  const setTargetWidth = targetWidth => {
    defaultTargetWidth = targetWidth;
  };

  const setTargetHeight = targetHeight => {
    defaultTargetHeight = targetHeight;
  };

  const setYModifier = cb => {
    defaultYModifier = cb;
  };

  const setXModifier = cb => {
    defaultXModifier = cb;
  };

  return {
    x,
    y,
    point,
    setTargetWidth,
    setTargetHeight,
    setYModifier,
    setXModifier
  };
}