import React, { Component } from 'react'
import { render } from 'react-dom'

console.log('Hello World!')

class App extends Component {
  render () {
    return <div>
      <h1>{this.props.text}</h1>
      <h3>(按下F12发现精彩)</h3>
      <p>:D</p>
    </div>
  }
}

render(<App text='Hello World!' />, document.getElementById('app'))
