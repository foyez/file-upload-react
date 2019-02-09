import React from 'react'
import axios from 'axios'

import DropDownArea from './dropdown_area'
import DropDownRoad from './dropdown_road'
import InputJson from './input_json'
import InputImage from './input_image'

const endpoint = 'http://localhost:8000/upload'

class FormComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      areas: [],
      roads: [],
      areaId: null,
      roadId: null,
      json: null,
      selectedFiles: null,
      loaded: 0,
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

  callUploadGeoId = roadId => {
    this.setState({
      roadId: roadId,
    })
  }

  callUploadData = (json) => {
    this.setState({
      json: json
    })
    console.log(json)
    // console.log(this.state.selectedFiles)
  }

  callUploadFiles = (files) => {
    this.setState({
      selectedFiles: files,
      loaded: 0
    })
  }

  handleUpload = () => {
    console.log(this.state.json)
    console.log(this.state.selectedFiles)

    // const json = this.state.json
    const images = this.state.selectedFiles
    const data = new FormData()

    data.append('imageLink', images[0], images[0].name)
    // data.append('longitude', json.data[0].longitude)
    // data.append('latitude', json.data[0].latitude)
    // data.append('geometry_id', this.state.roadId)

    axios
      .post(endpoint, data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          })
        },
      })
      .then(res => {
        console.log(res.statusText)
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
          cbFn={this.callUploadGeoId}
        />
        <InputJson
          cbFn={this.callUploadData}
        />
        <InputImage
          cbFn={this.callUploadFiles}
        />
        <button onClick={this.handleUpload}>Upload</button>
        <div> {Math.round(this.state.loaded, 2)} %</div>
        
      </div>
    ) : (
      <div>Hello</div>
    )
  }
}

export default FormComponent