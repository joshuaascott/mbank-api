/* Validate the input is only a number */
exports.validateNumber = (value, min, max) => {
  const regex = /^\d+$/;

  if (max === undefined) {
    return regex.test(value) && value >= min;
  } else {
    return regex.test(value) && value >= min && value <= max;
  }
};

/* Validate the input is only letters */
exports.validateAlpha = (value, min, max) => {
  const regex = /^[a-zA-Z]+$/;
  return regex.test(value) && value.length >= min && value.length <= max;
};

/* Validate the input is only letters and numbers */
exports.validateAlphaNum = (value, min, max) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(value) && value.length >= min && value.length <= max;
};

/* Validate the input is a valid email address */
exports.validateEmail = (value, min = 8, max = 50) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/;
  return regex.test(value) && value.length >= min && value.length <= max;
};

/* Validate the input is a valid password */
exports.validatePassword = (value, min = 4, max = 20) => {
  const regex = /^[a-zA-Z0-9!@#$%^&*()_\-+={}:;,.<>?`~'"[\]/]+$/;
  return regex.test(value) && value.length >= min && value.length <= max;
};

/* Validate the input with a custom regex expression */
exports.validateCustom = (regex, value, min, max) => {
  return regex.test(value) && value.length >= min && value.length <= max;
};
