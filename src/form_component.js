import React from 'react'
import axios from 'axios'

import DropDownArea from './dropdown_area'
import DropDownRoad from './dropdown_road'

class FormComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      areas: [],
      roads: [],
      areaId: null,
      roadId: null,
      validForm: false
    }
  }

  componentDidMount() {
    this.callAreas()
  }

  callAreas = () => {
    axios
      .get('https://map.barikoi.xyz:8070/api/area')
      .then(res => {
        const areas = res.data
        this.setState({
          areas: areas
        })
      })
  }

  callRoads = areaId => {
    axios
      .get(`https://map.barikoi.xyz:8070/api/area/get/road/${areaId}`)
      .then(res => {
        const roads = res.data
        this.setState({
          roads: roads,
          areaId: areaId
        })
      })
  }

  render() {
    const validForm = !this.state.validForm

    return { validForm } ? (
      <div>
        <DropDownArea
          areas={this.state.areas}
          defaultOption='Select an Area'
          cbFn={this.callRoads}
        />
        <DropDownRoad
          roads={this.state.roads}
          defaultOption='Select a Road'
        />
      </div>
    ) : (
      <div>Hello</div>
    )
  }
}

export default FormComponent