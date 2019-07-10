import React from "react";

import classes from "./Input.module.css";

const Input = props => {
  let inputEl = null;
  const inputClasses = [classes.InputEl];

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  switch (props.elType) {
    case "input":
      inputEl = (
        <input
          className={inputClasses.join(" ")}
          {...props.elConfig}
          value={props.value}
          onChange={props.changed}
          onBlur={props.blured}
        />
      );
      break;
    case "textarea":
      inputEl = (
        <textarea
          className={inputClasses.join(" ")}
          {...props.elConfig}
          value={props.value}
          onChange={props.changed}
          onBlur={props.blured}
        />
      );
      break;
    case "select":
      inputEl = (
        <select className={inputClasses.join(" ")} defaultValue={props.elConfig.defaultValue} onChange={props.changed}>
          <option disabled>{props.elConfig.defaultValue}</option>
          {props.elConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    // case "multi-select-checkbox":
    //   inputEl = (
    //     <select className={inputClasses.join(" ")} defaultValue={props.elConfig.defaultValue} onChange={props.changed}>
    //       <option disabled selected>
    //         {props.elConfig.defaultValue}
    //       </option>
    //       {props.elConfig.options.map(option => (
    //         <option key={option.value} value={option.value}>
    //           {option.displayValue}
    //         </option>
    //       ))}
    //     </select>
    //   );
    //   break;
    default:
      inputEl = (
        <input
          className={inputClasses.join(" ")}
          {...props.elConfig}
          value={props.value}
          onChange={props.changed}
          onBlur={props.blured}
        />
      );
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      <span className={classes.Error}>{props.error}</span>
      {inputEl}
    </div>
  );
};

export default Input;
