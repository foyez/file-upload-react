import React from "react";

const InputImage = props => {
  const handleSelectedFiles = e => {
    const selectedFiles = e.target.files;
    console.log(selectedFiles);
    props.cbFn(selectedFiles);
  };

  return (
    <div>
      <p className="attach-text">Attach Zip File(s):</p>
      <input type="file" accept=".zip" onChange={handleSelectedFiles} className="attach-file" multiple />
    </div>
  );
};

export default InputImage;
