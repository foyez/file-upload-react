import React from 'react'

class InputImage extends React.Component {
  // constructor(props) {
  //   super(props)
  //   console.log(this.props)
  // }

  handleSelectedFiles = (e) => {
    const selectedFiles = e.target.files
    console.log(selectedFiles)
    this.props.cbFn(selectedFiles)
  }

  render() {
    return (
      <div>
        <p className="attach-text">Attach images:</p>
        <input
          type='file'
          onChange={this.handleSelectedFiles}
          className="attach-file"
          multiple
        />
      </div>
    )
  }
}

export default InputImage