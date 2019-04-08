import React from "react";

class InputImage extends React.Component {
  handleSelectedFiles = e => {
    const selectedFiles = e.target.files;
    console.log(selectedFiles);
    this.props.cbFn(selectedFiles);
  };

  render() {
    return (
      <div>
        <p className="attach-text">Attach Zip File(s):</p>
        <input type="file" onChange={this.handleSelectedFiles} className="attach-file" multiple />
      </div>
    );
  }
}

export default InputImage;
