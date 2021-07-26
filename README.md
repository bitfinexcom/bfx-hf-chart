## Bitfinex Honey Framework Financial Charting Library for Node.JS

[![Build Status](https://travis-ci.org/bitfinexcom/bfx-hf-chart.svg?branch=master)](https://travis-ci.org/bitfinexcom/bfx-hf-chart)

This is the official Bitfinex financial charting library, released as part of the Honey Framework. It renders entirely on HTML5 canvas elements, and supports all Honey Framework trading indicators.

### Features
* 100% canvas rendering
* 100% Honey Framework indicator coverage
* High-performance with large datasets
* React wrapper component
* Fully customizable

### Installation

```bash
npm i --save bfx-hf-chart
```

### Quickstart & Example

To get started, utilize the React component to render & pass data to the chart:

```js
import React from 'react'
import BFXChart from '../dist/components/Chart/Chart'

const DATA = [....]

export default class Demo extends React.PureComponent {
  render () {
    return (
      <BFXChart
        candles={DATA}
        candleWidth='1m'
        width={800}
        height={600}
      />
    )
  }
}
```

Note that candle data is expected in Bitfinex array format, specifically:
```js
const data = [[
  mts,
  open,
  close,
  high,
  low,
  volume,
], ...]
```

### Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

### Note

This package will be maintained only via github, please use latest relases from github instead of npm.

Example on how to install specific version from github:
```
npm i --save-prod https://github.com/bitfinexcom/bfx-hf-chart.git#v1.0.7
```

Example on how to install it latest version from github:
```
npm i --save-prod https://github.com/bitfinexcom/bfx-hf-chart.git
```
