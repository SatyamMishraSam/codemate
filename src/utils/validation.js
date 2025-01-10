const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please Enter the Name Details");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a Valid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password");
  }
};

const validateEditProfile = (req) => {
  const allowedEdit = [
    "firstName",
    "lastName",
    "age",
    "photoURL",
    "gender",
    "about",
    "skills",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEdit.includes(field)
  );

  return isAllowed;
};

module.exports = { validateSignupData, validateEditProfile };
