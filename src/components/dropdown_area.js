import React from 'react'

class DropDownArea extends React.Component {

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
            className="dropdown"
            required
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