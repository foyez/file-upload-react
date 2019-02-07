import React from 'react'
import { render } from 'react-dom'
import FormComponent from './form_component'

const App = () => (
  <div>
    <FormComponent />
  </div>
)

render(<App />, document.getElementById('root'))