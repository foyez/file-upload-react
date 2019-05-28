import React from "react";

const InputImgJSON = props => {
  const handleSelectedFile = e => {
    const selectedFile = e.target.files[0];
    const fileReader = new FileReader();

    if (selectedFile) {
      fileReader.readAsText(selectedFile);
      fileReader.onload = e => {
        const result = JSON.parse(e.target.result);
        console.log(result);
        props.cbFn(result);
      };
    }
  };

  return (
    <div>
      <p className="attach-text">Attach Image JSON file:</p>
      <input type="file" accept=".json" onChange={handleSelectedFile} className="attach-file" />
    </div>
  );
};

export default InputImgJSON;
