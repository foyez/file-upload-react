import React from 'react'

class InputJson extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
  }

  handleSelectedFile = e => {
    const selectedFile = e.target.files[0]
    const fileReader = new FileReader()

    fileReader.readAsText(selectedFile)
    fileReader.onload = e => {
      const result = JSON.parse(e.target.result)
      console.log(result)
      this.props.cbFn(result)
    }
  }

  render() {
    return (
      <input
        type="file"
        onChange={this.handleSelectedFile}
      />
    )
  }
}

export default InputJson