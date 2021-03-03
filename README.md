# Scheval

A simple Javascript object/schema validator with simple and comprehensible API.

**Scheval** stands for **Sche**ma **Val**idator

## Why ??

There are several Javascript object/schema validation libraries around, for eg. [joi](https://github.com/sideway/joi) and [ajv](https://github.com/ajv-validator/ajv). Why not simply use one of them ? check my [motivations](#Motivation-behind-this-library).

## Installation

```bash
npm install @rblmdst/scheval
```

## Usage

You need 2 steps to validate an object with **scheval**

1- create a _validator_ by calling `createValidator` with a _validators configuration_.

The `createValidator` is a _factory_ that accepts a _validators configuration_ and return an object with a `validate` function that can be used to validate an object.

`createValidator` signature is the following one :

```ts
createValidator(config: ValidatorsConfig): { validate(val: any) => Array<{ field: string, error: string }>};
```

2- call the `validate` method of the _validator_ with the object you want to validate.

**Eg:**

```js
import { createValidator } from "@rblmdst/scheval";

const validatorConfig = {
  name: {
    type: ["string", "The name must be a string"],
    required: ["The name is required"],
    min: [2, "The name must consist of 2 caracters minimum"],
    max: [30, "The name must consist of 30 caracters maximum"],
  },
};

const validator = createValidator(validatorConfig);

const userInput = { name: "Obito" };

let validationErrors = validator.validate(userInput);
console.log(validationErrors); // []

validationErrors = validator.validate({});
console.log(validationErrors); // [ { field: 'name', error: 'The name is required' } ]
```

### The validators configuration

The _validators configuration_ is a simple Javascript object, each attribute of that object representing the name of a field to validate.

For eg. in the following code :

```js
const validatorConfig = {
  name: {
    type: ["string", "The name must be a string"],
    required: ["The name is required"],
    min: [2, "The name must consist of 2 caracters minimum"],
    max: [30, "The name must consist of 30 caracters maximum"],
  },
};
```

- `name` represent the field to validate in the object.
- `type`, `required`, `min` and `max` represents the _validators keys_
- to each _validator key_ is associate an array that contains validation information. For eg. the first item of the array associated to the `type` _validator key_ (ie. `"string"`) indicate that the type of field `name` must be `string`.

Note that the possible _validators keys_ depends on the type of value we want to validate. Refer to the [Validators signature](#Validators-signatures) for more details about possible _validators keys_.

The following _validators configuration_ :

```js
const validatorConfig = {
  name: {
    type: ["string", "The name must be a string"],
    required: ["The name is required"],
    min: [2, "The name must consist of 2 caracters minimum"],
    max: [30, "The name must consist of 30 caracters maximum"],
  },
};
```

means that the object we want to validate

- must have a `name` field and
- the value of that field must be of type `string`
- is required
- must be at least `2` characters long but no more than `30`

### The validation error

The value return by calling `validate` is an _array_, each item of the array representing an invalid field error.

The `validate` method return an empty array if the object we passed to it is valid.

**Eg :** Assuming that the following array is a validation error, then it means that the values of the fields `username` and `sex` of the object that we have validated are not valid.

```js
[
  { field: "username", error: "The username is required" },
  { field: "sex", error: "The sex is required" },
];
```

- `field` represents the invalid field name
- `error` represents the error message specified when creating the validator config.

### Examples

**Eg1 :**

```js
import { createValidator } from "@rblmdst/scheval";

const registrationInfosValidator = createValidator({
  username: {
    type: ["string", "The username must be a string"],
    required: ["The username is required"],
    min: [4, "The username must consist of 4 caracters minimum"],
    max: [15, "The username must consist of 15 caracters maximum"],
  },
  sex: {
    type: ["string", "The sex must be a string"],
    required: ["The sex is required"],
    enum: [["M", "F"], "Take value M or F"],
  },
  email: {
    required: ["The user email is required"],
    email: ["Invalid email address"],
  },
  age: {
    type: ["number", "The age must be a number"],
    integer: ["The age must be a integer"],
    ge: [18, "you are currently {{value}} only adult are authorized"],
  },
  isAdmin: {
    required: ["The user email is required"],
    type: ["boolean", "Must be boolean"],
  },
});

const user1 = {
  username: "Roberto",
  sex: "M",
  email: "test@test.test",
  age: 37,
  isAdmin: false,
};

let validationErrors = registrationInfosValidator.validate(user1);
console.log(validationErrors);
/*
Result:

[]
*/

const user2 = {
  username: "Anonymous",
  sex: "Male",
  email: "test@test.t",
  age: 17,
  isAdmin: 1,
};

validationErrors = registrationInfosValidator.validate(user2);
console.log(validationErrors);
/*
Result:

[
  { field: 'sex', error: 'Take value M or F' },
  { field: 'email', error: 'Invalid email address' },
  {
    field: 'age',
    error: 'you are currently 17 only adult are authorized'
  },
  { field: 'isAdmin', error: 'Must be boolean' }
]
*/

const user3 = {
  username: "AnonymousAnonymousAnonymous",
  sex: null,
  email: undefined,
  age: 17.5,
  isAdmin: true,
};
validationErrors = registrationInfosValidator.validate(user3);
console.log(validationErrors);
/*
Result:

[
  {
    field: 'username',
    error: 'The username must consist of 15 caracters maximum'
  },
  { field: 'sex', error: 'The sex is required' },
  { field: 'email', error: 'The user email is required' },
  { field: 'age', error: 'The age must be a integer' }
]
*/
const user4 = {
  email: "test@test.test",
  isAdmin: true,
};
validationErrors = registrationInfosValidator.validate(user4);
console.log(validationErrors);
/*
Result:

[
  { field: 'username', error: 'The username is required' },
  { field: 'sex', error: 'The sex is required' }
]
*/
```

**Eg2 :**
Assuming we expect an input to respect the following constraints

```js
{
  rank: string,
  members: string[]
}
```

so that a valid input can be for eg. :

```js
{
  rank: 'S',
  members: ['anom', 'yuzu', 'youri']
}
```

Then the _validators configuration_ will be the following one :

```js
 {
  rank: {
    type: ["string", "The rank must be a string"],
    required:["string", "The rank is required"],
    max: ["string", "1 character max"],
  },
  members: {
    type: ["array", "The members must be an array"],
    required:["string", "The members field is required"],
    ofType: ["string", "The members must be an array of string"],
  },
}
```

## Important Notes:

- If not specified as `required`, all the fields defined using a validation configuration are considered **optional** i.e their values are validated only if defined (i.e value different from `null` and `undefined`).

**eg :**

```js
const validatorConfig = {
  name: {
    type: ["string", "The name must be a string"],
    required: ["The name is required"],
  },
  job: {
    type: ["string", "The job must be a string"],
  },
};

const validator = createValidator(validatorConfig);

const userInput1 = { name: "Obito" };
let validationErrors = validator.validate(userInput1);
/* No error because the field `job` is optional */
console.log(validationErrors); // []

const userInput2 = { job: "unkown" };
validationErrors = validator.validate(userInput2);
/* Error because the field `name` is required */
console.log(validationErrors); // [ { field: "name", error: "The name is required" } ]

const userInput3 = { name: "Dotama", job: 2 };
validationErrors = validator.validate(userInput3);
/* Error because the field `job` is optional but must be of type 'string' if its value is defined */
console.log(validationErrors); // [ { field: "job", error: "The job must be a string" } ]
```

- The validation are only made on the fields specified in the validator configuration, this means that the extra fields that are present in the object to validate will not make the object invalid.

**eg :**

```js
/* => We want to valid only the 'name' field, other fields will be ignored */
const validatorConfig = {
  name: {
    type: ["string", "The name must be a string"],
    required: ["The name is required"],
  },
};

const validator = createValidator(validatorConfig);

const userInput1 = { name: "Obito", sex: "M", village: "Konoha" };

let validationErrors = validator.validate(userInput1);
/* Extra field `sex` and `village` do not make the object invalid */
console.log(validationErrors); // []

const userInput2 = { sex: "M", village: "Konoha" };
validationErrors = validator.validate(userInput2);
/* we only specified the `name` field in the validator config => Error because the field `name` is required */
console.log(validationErrors); // [ { field: "name", error: "The name is required" } ]
```

- It is not possible to directly validate nested object using **scheval**, but this is not a limitation because you can do that simply by validating the object step by step.

**eg: **

Assuming that we expect an input to respect the following constraints

```js
{
  rank: string,
  members: Array<{name: string}>
}
```

so that a valid input can be for eg. :

```js
{
  rank: 'S',
  members: [ {name: 'anom'}, {name: 'yuzu'} ]
}
```

Then we can do a step by step validation as follow

```js
/* The user input that we want to validate (eg. a POST request body) */
const userInput = {
  rank: "S",
  members: [{ name: "anom" }, { name: 2 }],
};

const baseValidatorConfig = {
  rank: {
    type: ["string", "The rank must be a string"],
    required: ["The rank is required"],
    max: ["string", "1 character max"],
  },
  members: {
    type: ["array", "The members must be an array"],
    required: ["The members field is required"],
    ofType: ["object", "The members must be an array of object"],
  },
};

const baseValidator = createValidator(baseValidatorConfig);

// First validation step
// No error here
const baseValidationError = baseValidator.validate(userInput);

if (baseValidationError.length) {
  // Do something with the validation error here if any
} else {
  const memberValidatorConfig = {
    name: {
      type: ["string", "The name must be a string"],
      required: ["The name is required"],
    },
  };
  const memberValidator = createValidator(memberValidatorConfig);

  // extract the 'members' field for validation
  const { members } = userInput;

  // Second step : Validate the members

  /* allMembersValidationErrors === [ 
      [], 
      [ { field: "name", error: "The name must be a string" } ] 
    ]
  */
  const allMembersValidationErrors = members.map((member) =>
    memberValidator.validate(member)
  );

  const aMemberIsInvalid = allMembersValidationErrors.some(
    (errors) => errors.length
  );

  if (aMemberIsInvalid) {
    allMembersValidationErrors.forEach((memberValidationErrors, i) => {
      if (memberValidationErrors.length) {
        // Do something with the validation error of member index "i"
      }
    });
  } else {
    // Put code to execute when the whole object is valid here
  }
}
```

## Validators signatures

**String Validators signature**

- `required: [errMsg]`
  - errMsg : string
- `type: [errMsg]`
  - errMsg : string
- `min: [min, errMsg]`
  - min : number
  - errMsg : string
- `max: [max, errMsg]`
  - max : number
  - errMsg : string
- `match: [regex, errMsg]`
  - regex: Regexp
  - errMsg : string
- `enum: [enums, errMsg]`

  - enums : string[]

  eg. `enum : [['m', 'f'], 'Possible value are "M" or "F"']`

  - errMsg : string

- `email: [errMsg]`
  - errMsg : string

**Boolean Validators signature**

- `required: [errMsg]`

  - errMsg : string

- `type: [errMsg]`
  - errMsg : string

**Object Validators signature**

- `required: [errMsg]`
  - errMsg : string
- `type: [errMsg]`
  - errMsg : string

**Number Validators signature**

- `required: [errMsg]`
  - errMsg : string
- `type: [errMsg]`
  - errMsg : string
- `integer: [errMsg]`
  - errMsg : string
- `le: [val, errMsg]`
  - val : number
  - errMsg : string
- `ge: [val, errMsg]`
  - val : number
  - errMsg : string
- `eq: [val, errMsg]`
  - val : number
  - errMsg : string
- `gt: [val, errMsg]`
  - val : number
  - errMsg : string
- `lt: [val, errMsg]`
  - val : number
  - errMsg : string
- `btw: [min, max, errMsg]`
  - min : number
  - max : number
  - errMsg : string

**Array validators signature**

- `required: [errMsg]`
  - errMsg : string
- `type: [errMsg]`
  - errMsg : string
- `ofType: [type, errMsg]`
  - type : 'string' | 'number' | 'boolean' | 'object'
  - errMsg : string
- `ofMinSize: [min, errMsg]`
  - min : number
  - errMsg : string
- `ofMaxSize: [max, errMsg]`
  - max : number
  - errMsg : string
- `ofSize: [size, errMsg]`
  - size : number
  - errMsg : string

## Motivation behind this library

- My native language is French, and I have noticed (at least before writing this library) that with most of the existing validator libraries eg. joi you do not have a total control on the error message you want to display and the error message are in English by default.
- I have find one library that allows to specified custom error message but it throws an error when there is an extra fields in the object to validate that are not specified in the validation configuration.
- I want to have a library with a simple validation configuration API easy to read and write.
