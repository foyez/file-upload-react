import React from "react";

const DropDownArea = props => {
  const handleSelectedArea = e => {
    console.log(e.target.value);
    const selectedArea = e.target.value;
    props.cbFn(selectedArea);
  };

  return (
    <div>
      <div>
        <select defaultValue={props.defaultOption} onChange={handleSelectedArea} className="dropdown">
          <option disabled>{props.defaultOption}</option>
          {props.areas.map(area => (
            <option key={area.id} value={area.id}>
              {area.area_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropDownArea;
