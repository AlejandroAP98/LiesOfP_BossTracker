import { render } from 'preact'
import './index.css'
import { App } from './App'

document.documentElement.setAttribute('data-theme', 'coffee')
render(<App />, document.getElementById('app')!)
