import React from "react";

class InputImage extends React.Component {
  // constructor(props) {
  //   super(props)
  //   console.log(this.props)
  // }

  handleSelectedFile = e => {
    // const selectedFiles = e.target.files;
    // console.log(selectedFiles);
    // this.props.cbFn(selectedFiles);
    const selectedFile = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(selectedFile);
    fileReader.onload = e => {
      const result = JSON.parse(e.target.result);
      console.log(result);
      this.props.cbFn(result);
    };
  };

  render() {
    return (
      <div>
        <p className="attach-text">Attach Geo JSON file:</p>
        <input type="file" onChange={this.handleSelectedFile} className="attach-file" />
      </div>
    );
  }
}

export default InputImage;
