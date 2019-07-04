import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

import classes from "./Form.module.css";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import { updateObj, checkValidity } from "../../shared/utility";

// const ENDPOINT = "https://api.barikoi.xyz:8080/api/streetview";
const ENDPOINT = "https://api.barikoi.xyz:8080/api/streetviewnew";

const options = [
  { value: "asphalt", label: "Asphalt" },
  { value: "concrete", label: "Concrete" },
  { value: "unpaved", label: "Unpaved" },
  { value: "good", label: "Good" },
  { value: "bad", label: "Bad" },
  { value: "disaster", label: "Disaster" }
];

const Form = () => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedRoadTypes, setSelectedRoadTypes] = useState(null);
  const [attachedImgJSON, setAttachedImgJSON] = useState(null);
  const [attachedRoadJSON, setAttachedRoadJSON] = useState(null);
  const [attachedZip, setAttachedZip] = useState(null);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    axios.get("https://map.barikoi.xyz:8070/api/area").then(res => {
      setAreas(res.data);
    });
  }, []);

  const optionsEl = [];
  areas.forEach(area => {
    const optionEl = {
      value: area.id,
      displayValue: area.area_name
    };
    optionsEl.push(optionEl);
  });

  const [form, setForm] = useState({
    area: {
      elType: "select",
      elConfig: {
        // options: [{ value: "fastest", displayValue: "Fastest" }, { value: "cheapest", displayValue: "Cheapest" }]
        defaultValue: "Select an area",
        options: [{ value: "fastest", displayValue: "Fastest" }, { value: "cheapest", displayValue: "Cheapest" }]
      },
      // value: "fastest",
      value: "",
      validation: {
        required: true
      },
      valid: true,
      error: ""
    },
    roadName: {
      elType: "input",
      elConfig: {
        type: "text",
        placeholder: "Road Name"
      },
      value: "",
      validation: {
        required: true,
        minLength: 4,
        maxLength: 8
      },
      valid: false,
      touched: false,
      error: ""
    },
    roadLane: {
      elType: "input",
      elConfig: {
        type: "text",
        placeholder: "Road Lane"
      },
      value: "",
      validation: {
        required: true,
        isNumber: true
      },
      valid: false,
      touched: false,
      error: ""
    },
    speed: {
      elType: "input",
      elConfig: {
        type: "text",
        placeholder: "Average Speed"
      },
      value: "",
      validation: {
        required: true,
        isNumber: true
      },
      valid: false,
      touched: false,
      error: ""
    },
    imgJSON: {
      elType: "input",
      elConfig: {
        type: "file",
        placeholder: "Image JSON",
        accept: ".json"
      },
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      error: ""
    },
    roadJSON: {
      elType: "input",
      elConfig: {
        type: "file",
        placeholder: "Road JSON",
        accept: ".json"
      },
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      error: ""
    },
    zipFile: {
      elType: "input",
      elConfig: {
        type: "file",
        placeholder: "Tiles Zip File",
        accept: ".zip"
      },
      value: "",
      validation: {},
      valid: true,
      error: ""
    }
  });

  const formElArr = [];
  for (let key in form) {
    formElArr.push({
      id: key,
      config: form[key]
    });
  }

  const handleInputChanged = (e, inputIdentifier) => {
    if (form[inputIdentifier].elConfig.type === "file") {
      if (inputIdentifier !== "zipFile") {
        const selectedFile = e.target.files[0];
        const fileReader = new FileReader();

        if (selectedFile) {
          fileReader.readAsText(selectedFile);
          fileReader.onload = e => {
            const json = JSON.parse(e.target.result);

            if (inputIdentifier === "imgJSON") {
              setAttachedImgJSON(json);
            } else if (inputIdentifier === "roadJSON") {
              setAttachedRoadJSON(json);
            }
          };
        }
      } else {
        const selectedZipFile = e.target.files;
        setAttachedZip(selectedZipFile);
      }
    }

    const returnedCheckValidity = checkValidity(e.target.value, form[inputIdentifier].validation);
    let errorMsg = "";
    for (let errType in returnedCheckValidity.error) {
      if (returnedCheckValidity.error[errType]) {
        errorMsg = returnedCheckValidity.error[errType];
      }
    }

    const updatedFormEl = updateObj(form[inputIdentifier], {
      value: e.target.value,
      valid: returnedCheckValidity.isValid,
      error: errorMsg,
      touched: true
    });
    const updatedOrderForm = updateObj(form, {
      [inputIdentifier]: updatedFormEl
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    setForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  const handleSelectChanged = selectedRoadTypes => {
    setSelectedRoadTypes(selectedRoadTypes);
    console.log(`Option selected:`, selectedRoadTypes);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const formData = {};
    for (let formElIdentifier in form) {
      if (formElIdentifier !== "imgJSON" && formElIdentifier !== "roadJSON") {
        formData[formElIdentifier] = form[formElIdentifier].value.trim();
      }
    }

    const imgJSON = { ...attachedImgJSON };
    if ("scenes" in imgJSON) {
      imgJSON.scenes.forEach((scene, i) => {
        scene.latitude = attachedRoadJSON.data[i].latitude;
        scene.longitude = attachedRoadJSON.data[i].longitude;
      });
    }
    console.log(imgJSON);

    const updatedRoadTypes = [];
    selectedRoadTypes.forEach(roadType => {
      updatedRoadTypes.push(roadType.value);
    });

    const data = new FormData();
    if (imgJSON !== null) {
      data.append("area", formData.area);
      data.append("road_name", formData.roadName);
      data.append("speed", formData.speed);
      data.append("road_lane", formData.roadLane);
      data.append("road_types", updatedRoadTypes);

      data.append("scenes", JSON.stringify(imgJSON.scenes));
      data.append("defaultLinkHotspots", JSON.stringify(imgJSON.defaultLinkHotspots));
      data.append("levels", JSON.stringify(imgJSON.levels));
      data.append("faceSize", imgJSON.faceSize);

      if (attachedZip) {
        data.append("zipFile", attachedZip[0], attachedZip[0].name);
      }
    }

    // Display the key/value pairs
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    if (imgJSON !== null && updatedRoadTypes.length > 0) {
      console.log("hello");

      axios
        .post(ENDPOINT, data, {
          onUploadProgress: ProgressEvent => {
            setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
            // this.setState({
            //   loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
            //   message: ""
            // });
            document.title = `(${Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100, 2)}%) Image Uploader`;
          }
        })
        .then(res => {
          if (res.statusText === "OK") {
            // this.setState({
            //   message: res.data.message
            // });
          }
        })
        .catch(err => {
          setLoaded(0);
          // this.setState({
          //   message: err.message, // 'Something is wrong :('
          //   loaded: 0
          // });
          console.log(err);
        });
    }

    console.log(formData);
    console.log(selectedRoadTypes);
    console.log(attachedImgJSON);
    console.log(attachedRoadJSON);
  };

  let formHTML = "Loading...";

  if (areas.length > 0) {
    formHTML = (
      <form onSubmit={handleSubmit}>
        {formElArr.map(formEl => {
          if (formEl.id === "area") {
            formEl.config.elConfig.options = optionsEl;
            formEl.config.elConfig.placeholder = "Area";
          }
          return (
            <Input
              key={formEl.id}
              elType={formEl.config.elType}
              elConfig={formEl.config.elConfig}
              value={formEl.config.value}
              invalid={!formEl.config.valid}
              shouldValidate={formEl.config.validation}
              touched={formEl.config.touched}
              label={formEl.config.elConfig.placeholder}
              error={formEl.config.error}
              changed={e => handleInputChanged(e, formEl.id)}
            />
          );
        })}
        <div className={classes.Input}>
          <label className={classes.Label}>Select Road Types</label>
          <Select
            className={classes.InputEl}
            closeMenuOnSelect={false}
            // components={animatedComponents}
            // defaultValue={}
            value={selectedRoadTypes}
            isMulti
            options={options}
            onChange={selectedRoadTypes => handleSelectChanged(selectedRoadTypes)}
          />
        </div>
        <Button btnType="Success" disabled={!formIsValid}>
          UPLOAD
        </Button>
        <span className={classes.UploadProgress}>{loaded > 0 ? `${Math.round(loaded, 2)}%` : ""}</span>
      </form>
    );
  }

  return (
    <div className={classes.Form}>
      <h2>Enter Your Data</h2>
      {formHTML}
    </div>
  );
};

export default Form;
