const validator = require("validator");
const signUpValidator = (body) => {
  const { firstName, lastName, emailId, age, password } = body;
  if (!firstName || !lastName) {
    throw new Error("Invalid first name ");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email Id");
  } else if (age < 18) {
    throw new Error("You must be 18 or above to Sign up");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};
module.exports = {
  signUpValidator,
};
