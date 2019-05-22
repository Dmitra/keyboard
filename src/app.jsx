import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import JssProvider from "react-jss/lib/JssProvider"
import { create } from "jss"
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles"
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Keyboard from './keyboard.jsx'
import './index.css'

import { 
  Layout,
} from './data'

export default class App extends Component {
  constructor () {
    super()

    this.state = {
      layouts: {},
      keyboard: {},
      app: {
        name: 'ubuntu-dmitra',
        layout: {}
      },
      context: '',
    }
  }

  componentDidMount () {
    console.log(this._isMounted)
    this._initLayout()
    $(window).on('resize', () => this.setState({}))
  }

  componentWillUnmount () {
    $(window).off('resize')
    console.log('UNMOUNT')
  }

  async _initLayout () {
    const physical = await Layout.getList('physical')
    const app = await Layout.getList('app')
    const keyboard = await Layout.get('physical', physical[0])
    this.setState({ layouts: { physical, app } })
    this.setState({ keyboard })
    // set default app layout
    if (this.state.app.name) this._onLayoutChange({
      target: {
        name: 'app',
        value: this.state.app.name,
      } 
    }, this.state.context)
    
  }

  render () {
    const appOptions = _.map(this.state.layouts.app, (app, i) => {
      return <MenuItem key={'app-option-'+i} value={app}>{_.capitalize(app)}</MenuItem>
    })
    appOptions.unshift(<MenuItem key="app-option-empty" value=""><em>None</em></MenuItem>)
    const contextOptions = _.map(_.keys(this.state.app.layout), (context, i) => {
      const label = context === 'undefined' ? 'any' : context
      return <MenuItem key={'context-option-'+i} value={context}>{label}</MenuItem>
    })

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
      <>
      <FormControlStyled>
        <InputLabel htmlFor="app-selector">Application</InputLabel>
        <Select
          key="select"
          value={this.state.app.name}
          onChange={this._onLayoutChange.bind(this)}
            inputProps={{
              name: 'app',
              id: 'app-selector',
            }}
        >{ appOptions }
        </Select>
      </FormControlStyled>
      { this.state.app.name &&
        <FormControlStyled>
          <InputLabel htmlFor="context-selector">Context</InputLabel>
          <Select
            key="select"
            value={this.state.context}
            onChange={this._onContextChange.bind(this)}
              inputProps={{
                name: 'context',
                id: 'context-selector',
              }}
          >{ contextOptions }
          </Select>
        </FormControlStyled>
      }

      <Keyboard 
        key="physical"
        keyboard={this.state.keyboard}
        app={this.state.app.layout}
        context={this.state.context}
      ></Keyboard>
      </>
      </JssProvider>
    )
  }

  // Event handlers

  async _onLayoutChange (e, context) {
    const type = e.target.name
    const name = e.target.value
    const layout = await Layout.get(type, name)
    context = _.isString(context) && context ? context : _.findKey(layout)
    this.setState({ [type]: { name, layout }, context })
  }

  _onContextChange (e) {
    this.setState({ context: e.target.value })
  }
}

const FormControlStyled = styled(FormControl)`
  min-width: 100px;
  margin: 4px;
`

const generateClassName = createGenerateClassName()
const jss = create({
  ...jssPreset(),
  // Define a custom insertion for injecting the JSS styles in the DOM
  insertionPoint: document.getElementById("jss-insertion-point")
})
