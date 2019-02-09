import React from 'react'

class InputImage extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
  }

  handleSelectedFiles = (e) => {
    const selectedFiles = e.target.files
    console.log(selectedFiles)
    this.props.cbFn(selectedFiles)
  }

  render() {
    return (
      <input
        type='file'
        onChange={this.handleSelectedFiles}
        multiple
      />
    )
  }
}

export default InputImage