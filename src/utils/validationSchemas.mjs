export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: "Username must be between 3 to 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "displayName cannot be empty",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
  },
};

export const updateUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: "Username must be between 3 to 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "displayName cannot be empty",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
  },
};

export const modifyUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: "Username must be between 3 to 32 characters",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
};
