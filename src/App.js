import React from "react";

import Form from "./containers/Form/Form";

const App = () => {
  return (
    <div className="App">
      <Form />
    </div>
  );
};

// class App extends React.Component {
//   state = {
//     areas: [],
//     roads: [],
//     areaId: null,
//     roadId: null,
//     roadName: "",
//     imgJSON: null,
//     geoJSON: null,
//     zipFile: null,
//     loaded: 0,
//     message: "",
//     validForm: false
//   };

//   componentDidMount() {
//     // this.callAreas();
//     axios.get("https://map.barikoi.xyz:8070/api/area").then(res => {
//       const areas = res.data;
//       this.setState({
//         areas
//       });
//     });
//   }

//   callRoads = areaId => {
//     axios.get(`https://map.barikoi.xyz:8070/api/area/get/road/${areaId}`).then(res => {
//       let roads = res.data;
//       roads = roads.sort((a, b) => {
//         if (a.road_name_number < b.road_name_number) {
//           return -1;
//         }
//         if (a.road_name_number > b.road_name_number) {
//           return 1;
//         }
//         return 0;
//       });

//       console.log(roads);
//       this.setState({
//         roads,
//         areaId
//       });
//     });
//   };

//   callUploadGeoId = (roadId, roadName) => {
//     this.setState({
//       roadId,
//       roadName
//     });
//   };

//   handleImgJSON = imgJSON => {
//     this.setState({
//       imgJSON
//       // roadName: imgJSON.name,
//     });
//   };

//   handleGeoJSON = geoJSON => {
//     this.setState({
//       geoJSON,
//       loaded: 0
//     });
//   };

//   handleZipFile = zipFile => {
//     this.setState({ zipFile });
//   };

//   handleUpload = () => {
//     if (this.state.imgJSON === null || this.state.geoJSON === null) {
//       this.setState({ message: "Please attach required files." });
//       return;
//     }

//     if (this.state.loaded === 100) {
//       this.setState({
//         // areas: [],
//         // roads: [],
//         // areaId: null,
//         // roadId: null,
//         // roadName: "",
//         // imgJSON: null,
//         // geoJSON: null,
//         // zipFile: null,
//         loaded: 0,
//         message: ""
//       });
//       document.title = `Image Uploader`;
//       return;
//     }

//     const imgJSON = { ...this.state.imgJSON };
//     const geoJSON = { ...this.state.geoJSON };

//     if (imgJSON.scenes.length !== geoJSON.data.length) {
//       this.setState({
//         message: `Image JSON (${imgJSON.scenes.length}) & GEO JSON (${geoJSON.data.length}) is not same length`
//       });
//       return;
//     } else if (!imgJSON.defaultLinkHotspots) {
//       this.setState({
//         message: "Please add defaultLinkHotspots..."
//       });
//       return;
//     }

//     imgJSON.scenes.forEach((scene, i) => {
//       scene.latitude = geoJSON.data[i].latitude;
//       scene.longitude = geoJSON.data[i].longitude;
//     });
//     imgJSON.geometry_id = this.state.roadId;

//     const data = new FormData();

//     if (imgJSON !== null && geoJSON !== null) {
//       data.append("geometry_id", this.state.roadId);
//       data.append("road_name", this.state.roadName);
//       data.append("defaultLinkHotspots", JSON.stringify(imgJSON.defaultLinkHotspots));
//       data.append("scenes", JSON.stringify(imgJSON.scenes));

//       data.append("faceSize", imgJSON.faceSize);
//       data.append("levels", JSON.stringify(imgJSON.levels));

//       if (this.state.zipFile) {
//         data.append("zipFile", this.state.zipFile[0], this.state.zipFile[0].name);
//       }

//       // Display the key/value pairs
//       for (var pair of data.entries()) {
//         console.log(pair[0] + ", " + pair[1]);
//       }

//       axios
//         .post(endpoint, data, {
//           onUploadProgress: ProgressEvent => {
//             this.setState({
//               loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
//               message: ""
//             });
//             document.title = `(${Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100, 2)}%) Image Uploader`;
//           }
//         })
//         .then(res => {
//           if (res.statusText === "OK") {
//             this.setState({
//               message: res.data.message
//             });
//           }
//         })
//         .catch(err => {
//           this.setState({
//             message: err.message, // 'Something is wrong :('
//             loaded: 0
//           });
//           console.log(err);
//         });
//     } else {
//       this.setState({
//         message: "Please select the required options."
//       });
//     }
//   };

//   render() {
//     const validForm = !this.state.validForm;

//     return { validForm } ? (
//       <div className="container">
//         <span className="message">{this.state.message}</span>
//         <DropDownArea areas={this.state.areas} defaultOption="Select an Area" cbFn={this.callRoads} />
//         <DropDownRoad roads={this.state.roads} defaultOption="Select a Road" cbFn={this.callUploadGeoId} />
//         <InputImgJSON cbFn={this.handleImgJSON} />
//         <InputGeoJSON cbFn={this.handleGeoJSON} />
//         <AttachZip cbFn={this.handleZipFile} />
//         <div className="btn-box">
//           <button
//             disabled={this.state.loaded !== 0 && this.state.loaded !== 100}
//             onClick={this.handleUpload}
//             className="upload-btn">
//             {this.state.loaded === 100 ? "Upload again" : "Upload"}
//           </button>
//           <span className="percentage"> {Math.round(this.state.loaded, 2)} %</span>
//         </div>
//       </div>
//     ) : (
//       <div>Hello</div>
//     );
//   }
// }

export default App;
