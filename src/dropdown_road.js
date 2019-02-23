import React from 'react'

class DropDownRoad extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
  }

  handleSelectedRoad = (e) => {
    const selectedRoad = e.target.value
    const selectedIndex = e.nativeEvent.target.selectedIndex
    const selectedText = e.nativeEvent.target[selectedIndex].text
    console.log(selectedRoad)
    console.log(selectedText)
    this.props.cbFn(selectedRoad, selectedText)
  }

  render() {
    return (
      <div>
        <div>
          <select 
            defaultValue={this.props.defaultOption}
            onChange={this.handleSelectedRoad}
            className="dropdown"
            required
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