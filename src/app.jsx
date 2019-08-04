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
      layout: {
        physical: {},
        visual: {},
        functional: {},
        context: '',
      }
    }
  }

  componentDidMount () {
    this._initLayout()
    $(window).on('resize', () => this.setState({}))
  }

  componentDidUpdate () {
    this._setURL()
  }

  componentWillUnmount () {
    $(window).off('resize')
  }

  async _initLayout () {
    const params = new URLSearchParams(window.location.search)
    const physicals = await Layout.getList('physical')
    const visuals = await Layout.getList('visual')
    const functionals = await Layout.getList('functional')
    const physical = await Layout.get('physical', params.get('physical') || physicals[0])
    const visual = await Layout.get('visual', params.get('visual') || visuals[0])
    const functional = await Layout.get('functional', params.get('functional') || functionals[0])
    const defaultContext = functional.layout['undefined'] ? 'undefined' : _.keys(functional.layout)[0]
    const context = params.get('context') || defaultContext 
    this.setState({
      layouts: { physical: physicals, visual: visuals, functional: functionals },
      layout: { physical, visual, functional, context },
      keys: _(params.get('keys')).castArray().compact().value(),
    })
  }

  render () {
    const physicalOptions = _.map(this.state.layouts.physical, (layout, i) => {
      return <MenuItem key={'layout-option-'+i} value={layout}>{_.capitalize(layout)}</MenuItem>
    })
    const visualOptions = _.map(this.state.layouts.visual, (layout, i) => {
      return <MenuItem key={'layout-option-'+i} value={layout}>{_.capitalize(layout)}</MenuItem>
    })
    const functionalOptions = _.map(this.state.layouts.functional, (layout, i) => {
      return <MenuItem key={'layout-option-'+i} value={layout}>{_.capitalize(layout)}</MenuItem>
    })
    functionalOptions.unshift(<MenuItem key="layout-option-empty" value=""><em>None</em></MenuItem>)
    const contextOptions = _.map(_.keys(this.state.layout.functional.layout), (context, i) => {
      const label = context === 'undefined' ? 'any' : context
      return <MenuItem key={'context-option-'+i} value={context}>{label}</MenuItem>
    })

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
      <>
      <FormControlStyled>
        <InputLabel htmlFor="physical-selector">Physical</InputLabel>
        <Select
          key="select"
          value={this.state.layout.physical.name || ""}
          onChange={this._onLayoutChange.bind(this)}
          inputProps={{
            id: 'physical-selector',
            name: 'physical',
          }}
        >{ physicalOptions }
        </Select>
      </FormControlStyled>
      <FormControlStyled>
        <InputLabel htmlFor="visual-selector">Visual</InputLabel>
        <Select
          key="select"
          value={this.state.layout.visual.name || ""}
          onChange={this._onLayoutChange.bind(this)}
          inputProps={{
            id: 'visual-selector',
            name: 'visual',
          }}
        >{ visualOptions }
        </Select>
      </FormControlStyled>
      <FormControlStyled>
        <InputLabel htmlFor="functional-selector">Application</InputLabel>
        <Select
          key="select"
          value={this.state.layout.functional.name || ""}
          onChange={this._onLayoutChange.bind(this)}
          inputProps={{
            id: 'functional-selector',
            name: 'functional',
          }}
        >{ functionalOptions }
        </Select>
      </FormControlStyled>
      { this.state.layout.functional.name &&
        <FormControlStyled>
          <InputLabel htmlFor="context-selector">Context</InputLabel>
          <Select
            key="select"
            value={this.state.layout.context}
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
        key="layout"
        layout={this.state.layout}
        fixed={this.state.keys}
        onChange={this._onKeyPress.bind(this)}
      ></Keyboard>
      </>
      </JssProvider>
    )
  }

  // Event handlers

  _setURL () {
    const params = new URLSearchParams()
    params.set('physical', this.state.layout.physical.name)
    params.set('visual', this.state.layout.visual.name)
    params.set('functional', this.state.layout.functional.name)
    params.set('context', this.state.layout.context)
    params.set('keys', this.state.keys)
    history.replaceState(this.state, '', '?' + params.toString())
  }

  async _onLayoutChange (e, context) {
    const type = e.target.name
    const name = e.target.value
    const layout = await Layout.get(type, name)
    this.state.layout[type] = layout
    if (context) this.state.layout.context = _.isString(context) ? context : _.findKey(layout)
    this.setState(this.state)
  }

  _onContextChange (e) {
    const state = this.state
    state.layout.context = e.target.value
    this.setState(state)
  }

  _onKeyPress (keys) {
    this.setState({ keys })
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
