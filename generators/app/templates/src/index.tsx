import * as React from 'react'
import { render } from 'react-dom'

console.log('Hello World!')

interface AppProps { text: string }
class App extends React.Component<AppProps, {}> {
  render () {
    return <div>
      <h1>{this.props.text}</h1>
      <h3>(按下F12发现精彩)</h3>
      <p>:D</p>
    </div>
  }
}

render(<App text='Hello World!' />, document.getElementById('app'))
