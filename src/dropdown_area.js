import React from 'react'

class DropDownArea extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
  }

  handleSelectedArea = e => {
    console.log(e.target.value)
    const selectedArea = e.target.value
    this.props.cbFn(selectedArea)
  }

  render() {
    return (
      <div>
        <div>
          <select
            defaultValue={this.props.defaultOption}
            onChange={this.handleSelectedArea}
          >
            <option disabled>{this.props.defaultOption}</option>
            { this.props.areas.map(area => <option key={area.id} value={area.id}>{area.area_name}</option>) }
          </select>
        </div>
      </div>
    )
  }
}

export default DropDownArea