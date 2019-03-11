import React from 'react'
import axios from 'axios'

import DropDownArea from '../components/dropdown_area'
import DropDownRoad from '../components/dropdown_road'
import InputJson from '../components/input_json'
import InputImage from '../components/input_image'

const endpoint = 'http://192.168.0.112/api/streetview'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      areas: [],
      roads: [],
      areaId: null,
      roadId: null,
      roadName: '',
      json: null,
      selectedFiles: null,
      loaded: 0,
      message: '',
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
        let roads = res.data
        roads = roads.sort((a, b) => {
          if(a.road_name_number < b.road_name_number) { return -1; }
          if(a.road_name_number > b.road_name_number) { return 1; }
          return 0;
        })

        console.log(roads);
        this.setState({
          roads: roads,
          areaId: areaId
        })
      })
  }

  callUploadGeoId = (roadId, roadName) => {
    this.setState({
      roadId: roadId,
      roadName: roadName,
    })
  }

  callUploadData = (json) => {
    this.setState({
      json: json
    })
    console.log(json)
    console.log(this.state.roadName)
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
    

    const json = this.state.json
    const images = this.state.selectedFiles
    const data = new FormData()

    console.log(typeof(images))
    console.log(json)
    console.log(images)

    if(json !== null && images !== null) {
      json.data.forEach((element, i) => {
      data.append('imageLink[]', images[i], images[i].name)
      data.append('longitude[]', json.data[i].longitude)
      data.append('latitude[]', json.data[i].latitude)
      data.append('geometry_id[]', this.state.roadId)
      data.append('road_name[]', this.state.roadName)
    })

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
        if(res.statusText === 'OK') {
          this.setState({
            message: 'Your files are uploaded successfully :)'
          })
        }
      })
      .catch(err => {
        this.setState({
          message: 'Something is wrong :(',
          loaded: 0
        })
        console.log(err)
      })
    } else {
      this.setState({
        message: 'Please select the required options.'
      })
    }
  }

  render() {
    const validForm = !this.state.validForm

    return { validForm } ? (
      <div className="container">
        <span className="message">{this.state.message}</span>
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
        <button 
          disabled={this.state.loaded !== 0}
          onClick={this.handleUpload}
          className="upload-btn"
        >Upload</button>
        <span className="percentage"> {Math.round(this.state.loaded, 2)} %</span>
        
      </div>
    ) : (
      <div>Hello</div>
    )
  }
}

export default App