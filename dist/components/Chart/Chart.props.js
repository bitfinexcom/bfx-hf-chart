import PropTypes from 'prop-types';
export const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  showMarketLabel: PropTypes.bool,
  extraHeaderComponentsLeft: PropTypes.any,
  extraHeaderComponentsRight: PropTypes.any
};
export const defaultProps = {
  showMarketLabel: true
};