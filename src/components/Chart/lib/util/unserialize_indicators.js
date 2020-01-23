import BFXI from 'bfx-hf-indicators'

export default (indicators) => {
  try {
    return JSON.parse(indicators).map(([iClassID, iArgs, iColors]) => (
      [Object.values(BFXI).find(i => i.id === iClassID), iArgs, iColors]
    ))
  } catch (e) {
    console.error(`invalid indicators JSON: ${e.stack}`)
    return []
  }
}
