import joi from 'joi';
import controllerResponse from '../helpers/controllerResponse';

const props = {
  genericName: joi
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z]+$/)
    .error(new Error('name must be valid alphabets not less than 2 characters')),
  password: joi
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .error(
      new Error(
        'password should contain at least, 6 characters, 1 uppercase and 1 lowercase character',
      ),
    ),
  email: joi.string().email({ minDomainAtoms: 2 }),
  phoneNumber: joi
    .string()
    .trim()
    .regex(/^[0-9]+$/)
    .min(10)
    .max(14)
    .error(new Error('please enter valid phone number digits: XXXXXXXXXX')),
  sex: joi
    .string()
    .trim()
    .lowercase()
    .valid(['male', 'female', 'm', 'f']),
  address: joi
    .string()
    .trim()
    .lowercase()
    .min(10)
    .max(120)
    .error(new Error('only letters and characters are allowed')),
  amount: joi
    .number()
    .min(0.01)
    .precision(5)
    .required(),
  accountType: joi
    .string()
    .trim()
    .lowercase()
    .valid(['savings', 'current']),
  accountStatus: joi
    .string()
    .trim()
    .lowercase()
    .valid(['draft', 'active', 'dormant']),
  userType: joi
    .string()
    .trim()
    .lowercase()
    .valid(['', 'client', 'cashier', 'admin']),
};

const validator = {
  validate: (object, req, res, next) => {
    const authSchema = joi.object(object).required();

    joi.validate(req.body, authSchema, (error, data) => {
      if (!error) {
        req.body = data;
        next();
      } else {
        controllerResponse.errorResponse(res, 400, error);
      }
    });
  },

  validateSignUp(req, res, next) {
    const userProps = {
      email: props.email.required(),
      firstname: props.genericName.required(),
      lastname: props.genericName.required(),
      othername: props.genericName,
      password: props.password.required(),
      sex: props.sex.required(),
      phoneNumber: props.phoneNumber.required(),
      address: props.address,
    };

    validator.validate(userProps, req, res, next);
  },

  validateSignIn(req, res, next) {
    const userProps = {
      email: props.email.required(),
      password: props.password.required(),
    };

    validator.validate(userProps, req, res, next);
  },

  validateUserUpdate(req, res, next) {
    const userProps = {
      lastname: props.genericName,
      sex: props.sex,
      phoneNumber: props.phoneNumber,
      address: props.address,
    };

    validator.validate(userProps, req, res, next);
  },

  validateAccountCreate(req, res, next) {
    const accountProps = {
      type: props.accountType,
    };

    validator.validate(accountProps, req, res, next);
  },

  validateAccountUpdate(req, res, next) {
    const accountProps = {
      status: props.accountStatus,
      type: props.accountType,
    };

    validator.validate(accountProps, req, res, next);
  },

  validateTransaction(req, res, next) {
    const accountProps = {
      amount: props.amount,
    };

    validator.validate(accountProps, req, res, next);
  },
};

export default validator;
