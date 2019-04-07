import React from "react";
import axios from "axios";

import DropDownArea from "../components/dropdown_area";
import DropDownRoad from "../components/dropdown_road";
import InputImgJSON from "../components/InputImgJSON";
import InputGeoJSON from "../components/InputGeoJSON";

// const endpoint = 'http://192.168.0.112/api/streetview'
// const endpoint = "https://api.barikoi.xyz:8080/api/streetview";
const endpoint = "http://192.168.0.112/api/streetviewNew";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      areas: [],
      roads: [],
      areaId: null,
      roadId: null,
      roadName: "",
      imgJSON: null,
      geoJSON: null,
      loaded: 0,
      message: "",
      validForm: false
    };
  }

  componentDidMount() {
    // this.callAreas();
    axios.get("https://map.barikoi.xyz:8070/api/area").then(res => {
      const areas = res.data;
      this.setState({
        areas
      });
    });
  }

  // callAreas = () => {
  //   axios.get("https://map.barikoi.xyz:8070/api/area").then(res => {
  //     const areas = res.data;
  //     this.setState({
  //       areas: areas
  //     });
  //   });
  // };

  callRoads = areaId => {
    axios.get(`https://map.barikoi.xyz:8070/api/area/get/road/${areaId}`).then(res => {
      let roads = res.data;
      roads = roads.sort((a, b) => {
        if (a.road_name_number < b.road_name_number) {
          return -1;
        }
        if (a.road_name_number > b.road_name_number) {
          return 1;
        }
        return 0;
      });

      console.log(roads);
      this.setState({
        roads,
        areaId
      });
    });
  };

  callUploadGeoId = (roadId, roadName) => {
    this.setState({
      roadId,
      roadName
    });
  };

  handleImgJSON = imgJSON => {
    this.setState({
      imgJSON
      // roadName: imgJSON.name,
    });
    // console.log(imgJSON);
    // console.log('Road Name: ', this.state.roadName)
  };

  handleGeoJSON = geoJSON => {
    this.setState({
      geoJSON,
      loaded: 0
    });
  };

  handleUpload = () => {
    // this.state.imgJSON.scenes.forEach(scene => {
    //   // scene.geometry_id = this.state.roadId;
    //   this.state.geoJSON.data.forEach(point => {
    //     scene.latitude = point.latitude;
    //     scene.longitude = point.longitude;
    //   });
    // });

    const imgJSON = { ...this.state.imgJSON };
    const geoJSON = { ...this.state.geoJSON };

    imgJSON.scenes.forEach((scene, i) => {
      scene.latitude = geoJSON.data[i].latitude;
      scene.longitude = geoJSON.data[i].longitude;
    });
    imgJSON.geometry_id = this.state.roadId;

    console.log(imgJSON);

    // console.log(this.state.json);
    // console.log(this.state.geoJSON);
    // const json = this.state.json;
    // const images = this.state.geoJSON;
    const data = new FormData();
    // let scenes;
    // // console.log(typeof(images))
    // console.log(json);
    // console.log(images);
    // console.log(this.state.roadName);
    if (imgJSON !== null && geoJSON !== null) {
      // imgJSON.scenes.forEach((scene, i) => {
      //   // data.append("imageLink[]", images[i], images[i].name);
      //   data.append("id", scene.id);
      //   data.append("longitude", scene.longitude);
      //   data.append("latitude", scene.latitude);
      //   data.append("levels[]", scene.levels);
      //   data.append("faceSize", scene.faceSize);
      //   data.append("initialViewParameters", scene.initialViewParameters);
      //   data.append("linkHotspots[]", scene.linkHotspots);
      // });

      data.append("geometry_id", this.state.roadId);
      data.append("road_name", this.state.roadName);
      // imgJSON.scenes.forEach((scene, i) => {
      //   data.append("scene.id", scene.id);
      // });
      data.append("scenes", JSON.stringify(imgJSON.scenes));
      // console.log(imgJSON.scenes);

      // Display the key/value pairs
      for (var pair of data.entries()) {
        console.log(pair[0] + ", " + pair[1]);
        // console.log(JSON.parse(pair[1]));
      }

      axios
        .post(endpoint, data, {
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
              message: ""
            });
          }
        })
        .then(res => {
          console.log(res.statusText);
          if (res.statusText === "OK") {
            this.setState({
              message: "Your files are uploaded successfully :)"
            });
          }
        })
        .catch(err => {
          this.setState({
            message: err.message, // 'Something is wrong :('
            loaded: 0
          });
          console.log(err);
        });
    } else {
      this.setState({
        message: "Please select the required options."
      });
    }
  };

  render() {
    const validForm = !this.state.validForm;

    return { validForm } ? (
      <div className="container">
        <span className="message">{this.state.message}</span>
        <DropDownArea areas={this.state.areas} defaultOption="Select an Area" cbFn={this.callRoads} />
        <DropDownRoad roads={this.state.roads} defaultOption="Select a Road" cbFn={this.callUploadGeoId} />
        <InputImgJSON cbFn={this.handleImgJSON} />
        <InputGeoJSON cbFn={this.handleGeoJSON} />
        <button disabled={this.state.loaded !== 0} onClick={this.handleUpload} className="upload-btn">
          Upload
        </button>
        <span className="percentage"> {Math.round(this.state.loaded, 2)} %</span>
      </div>
    ) : (
      <div>Hello</div>
    );
  }
}

export default App;
