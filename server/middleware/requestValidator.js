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
  email: joi
    .string()
    .email({ minDomainAtoms: 2 })
    .error(new Error('email address not valid')),
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
    .valid(['male', 'female'])
    .error(new Error('gender should be either male or female')),
  address: joi
    .string()
    .trim()
    .lowercase()
    .min(10)
    .max(120)
    .error(new Error('only letters and digits are allowed')),
  staffType: joi
    .string()
    .trim()
    .lowercase()
    .valid(['cashier', 'admin'])
    .error(new Error('required cashier or admin')),
  //= ==========================================================
  amount: joi
    .number()
    .min(0.01)
    .precision(5)
    .required()
    .error(new Error('please enter a valid amount')),
  accountType: joi
    .string()
    .trim()
    .lowercase()
    .valid(['savings', 'current'])
    .error(new Error('required savings or current account type')),
  accountStatus: joi
    .string()
    .trim()
    .lowercase()
    .valid(['draft', 'active', 'dormant'])
    .error(new Error('required active or dormant')),
  accountNumber: joi
    .string()
    .trim()
    .length(10)
    .regex(/^[0-9]+$/)
    .error(new Error('invalid account number')),
  number: joi
    .string()
    .trim()
    .error(new Error('invalid parameter for number'))
    .regex(/^[0-9]+$/),
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
  validateParams: (object, req, res, next) => {
    const authSchema = joi.object(object);

    joi.validate(req.params, authSchema, (error, data) => {
      if (!error) {
        req.params = data;
        next();
      } else {
        controllerResponse.errorResponse(res, 400, error);
      }
    });
  },

  validateSignIn(req, res, next) {
    const userProps = {
      email: props.email.required(),
      password: props.password.required(),
    };

    validator.validate(userProps, req, res, next);
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

  validateCreateStaff(req, res, next) {
    const userProps = {
      email: props.email.required(),
      firstname: props.genericName.required(),
      lastname: props.genericName.required(),
      othername: props.genericName,
      password: props.password.required(),
      type: props.staffType.required(),
      sex: props.sex.required(),
      phoneNumber: props.phoneNumber.required(),
      address: props.address,
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
      type: props.accountType.required(),
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

  validateAccountParams(req, res, next) {
    const numberProps = { accountNumber: props.accountNumber };
    validator.validateParams(numberProps, req, res, next);
  },

  validateIdParams(req, res, next) {
    const numberProps = { id: props.number };
    validator.validateParams(numberProps, req, res, next);
  },

  validateTrxParams(req, res, next) {
    const trxProps = { transactionId: props.number };
    validator.validateParams(trxProps, req, res, next);
  },

  validateEmailParams(req, res, next) {
    const emailProps = { userEmail: props.email };
    validator.validateParams(emailProps, req, res, next);
  },
};

export default validator;
