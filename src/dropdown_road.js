import React from 'react'

class DropDownRoad extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
  }

  handleSelectedRoad = (e) => {
    const selectedRoad = e.target.value
    console.log(selectedRoad)
    this.props.cbFn(selectedRoad)
  }

  render() {
    return (
      <div>
        <div>
          <select 
            defaultValue={this.props.defaultOption}
            onChange={this.handleSelectedRoad}
          >
            <option disabled>{this.props.defaultOption}</option>
            { this.props.roads.map(road => <option key={road.id} value={road.id}>{road.road_name_number}</option>)}
          </select>
        </div>
      </div>
    )
  }
}

export default DropDownRoad