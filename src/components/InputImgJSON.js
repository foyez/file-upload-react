import React from "react";

class InputImgJSON extends React.Component {
  handleSelectedFile = e => {
    const selectedFile = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(selectedFile);
    fileReader.onload = e => {
      const result = JSON.parse(e.target.result);
      console.log(result);
      this.props.cbFn(result);
    };

    // const selectedFile = e.target.files[0];
    // const fileReader = new FileReader();

    // fileReader.readAsText(selectedFile);
    // fileReader.onload = e => {
    //   console.log(e.target.result);
    //   const result = JSON.parse(e.target.result);
    //   console.log(result);
    //   this.props.cbFn(result);
    // };
  };

  render() {
    return (
      <div>
        <p className="attach-text">Attach Image JSON file:</p>
        <input type="file" onChange={this.handleSelectedFile} className="attach-file" />
      </div>
    );
  }
}

export default InputImgJSON;
