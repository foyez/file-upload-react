import React from "react";

const DropDownRoad = props => {
  const handleSelectedRoad = e => {
    const selectedRoad = e.target.value;
    const selectedIndex = e.nativeEvent.target.selectedIndex;
    const selectedRoadName = e.nativeEvent.target[selectedIndex].text;
    console.log(selectedRoad);
    console.log(selectedRoadName);
    props.cbFn(selectedRoad, selectedRoadName);
  };

  return (
    <div>
      <div>
        <select defaultValue={props.defaultOption} onChange={handleSelectedRoad} className="dropdown">
          <option disabled>{props.defaultOption}</option>
          {props.roads.map(road => (
            <option key={road.id} value={road.id}>
              {road.road_name_number} - {road.id}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropDownRoad;
