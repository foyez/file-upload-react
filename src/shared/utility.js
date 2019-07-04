export const updateObj = (oldObj, updatedProperties) => {
  return {
    ...oldObj,
    ...updatedProperties
  };
};

export const checkValidity = (value, rules) => {
  let isValid = true;
  let error = {
    required: "",
    length: "",
    isNumber: ""
  };

  if (!rules) {
    return true;
  }

  // switch (rules) {
  //   case rules.required:
  //     isValid = value.trim() !== "" && isValid;

  //     if (!isValid) {
  //       const required = "This field is required.";
  //       const updatedError = updateObj(error, { required });
  //       error = updatedError;
  //     }
  //     break;
  //   case rules.isNumber:
  //     const pattern = /^-?[\d.]+(?:e-?\d+)?$/;
  //     isValid = pattern.test(value) && isValid;

  //     if (!isValid && error.required === "") {
  //       const isNumber = `Field input should be number`;
  //       const updatedError = updateObj(error, { isNumber });
  //       error = updatedError;
  //     }
  //     break;
  //   case rules.minLength:
  //     isValid = value.length >= rules.minLength && isValid;

  //     if (!isValid && error.required === "") {
  //       const length = `Field length should be minimum ${rules.minLength}.`;
  //       const updatedError = updateObj(error, { length });
  //       error = updatedError;
  //     }
  //     break;

  //   case rules.maxLength:
  //     isValid = value.length <= rules.maxLength && isValid;

  //     if (!isValid && error.required === "") {
  //       const length = error.length
  //         ? `Field length should be between ${rules.minLength} and ${rules.maxLength}.`
  //         : `Field length should be maximum ${rules.maxLength}.`;
  //       const updatedError = updateObj(error, { length });
  //       error = updatedError;
  //     }
  //     break;
  //   default:
  //     isValid = value.trim() !== "" && isValid;

  //     if (!isValid) {
  //       const required = "This field is required.";
  //       const updatedError = updateObj(error, { required });
  //       error = updatedError;
  //     }
  // }

  // error messages priority
  // 1. required
  // 2. isNumeric, isEmail
  // 3. minLength, maxLength

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;

    if (!isValid) {
      const required = "This field is required.";
      const updatedError = updateObj(error, { required });
      error = updatedError;
    }
  }

  if (rules.isNumber) {
    const pattern = /^-?[\d.]+(?:e-?\d+)?$/;
    isValid = pattern.test(value) && isValid;

    if (!isValid && error.required === "") {
      const isNumber = `Field input should be number`;
      const updatedError = updateObj(error, { isNumber });
      error = updatedError;
    }
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;

    if (!isValid && error.required === "") {
      const length = `Field length should be minimum ${rules.minLength}.`;
      const updatedError = updateObj(error, { length });
      error = updatedError;
    }
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;

    if (!isValid && error.required === "") {
      const length = error.length
        ? `Field length should be between ${rules.minLength} and ${rules.maxLength}.`
        : `Field length should be maximum ${rules.maxLength}.`;
      const updatedError = updateObj(error, { length });
      error = updatedError;
    }
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
  }

  return { isValid, error };
};
