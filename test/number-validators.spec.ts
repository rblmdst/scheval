import { expect } from "chai";
import { createValidator } from "../src/index";

describe("Number validators", () => {
  it("Shoud return an error when the value is not a number", () => {
    const validatorsConfig = {
      age: {
        type: ["number", "The age must be a number"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const validInputs = [
      { age: 4 },
      { age: -4 },
      { age: 0 },
      { age: +2 },
      { age: 0.36 },
      { age: -1.96 },
    ];
    const invalidInputs: any[] = [
      { age: Infinity },
      { age: [] },
      { age: {} },
      { age: +"ab" },
      { age: true },
      { age: false },
      { age: "" },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "age", error: "The age must be a number" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });
  it("Should return an error when the value is required but undefined or null is passed as value", () => {
    const validatorsConfig = {
      age: {
        type: ["number", "The age must be a number"],
        required: ["The age is required"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInput = { age: 23 };
    const invalidInputs: any[] = [{ age: null }, { age: undefined }, {}];
    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([{ field: "age", error: "The age is required" }]);
    });

    const result = validator.validate(validInput);
    expect(result).to.eql([]);
  });

  it("Should not return an error when the value is optional and undefined or null is passed as value", () => {
    const validatorsConfig = {
      age: {
        type: ["number", "The age must be a number"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInputs: any[] = [{ age: null }, { age: undefined }, {}];
    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return an error when the value is not lower than the specified value", () => {
    const validatorsConfig = {
      delta: {
        type: ["number", "The delta must be a number"],
        lt: [18, "The delta should be lower than 18"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const validInputs = [
      { delta: -16 },
      { delta: 0 },
      { delta: -0.5 },
      { delta: 17.99 },
    ];
    const invalidInputs: any[] = [
      { delta: 18 },
      { delta: 19 },
      { delta: 30.5 },
      { delta: 400 },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "delta", error: "The delta should be lower than 18" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return an error when the value is not greater than the specified value", () => {
    const validatorsConfig = {
      delta: {
        type: ["number", "The delta must be a number"],
        gt: [18, "The delta should be greater than 18"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInputs = [
      { delta: -16 },
      { delta: 0 },
      { delta: -0.5 },
      { delta: 17.99 },
      { delta: 18 },
    ];
    const validInputs: any[] = [{ delta: 19 }, { delta: 30.5 }, { delta: 400 }];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "delta", error: "The delta should be greater than 18" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return an error when the value is not lower or equal to the specified value", () => {
    const validatorsConfig = {
      delta: {
        type: ["number", "The delta must be a number"],
        le: [18, "The delta should be lower or equal to 18"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const validInputs = [
      { delta: -16 },
      { delta: 0 },
      { delta: -0.5 },
      { delta: 17.99 },
      { delta: 18 },
    ];
    const invalidInputs: any[] = [
      { delta: 19 },
      { delta: 30.5 },
      { delta: 400 },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "delta", error: "The delta should be lower or equal to 18" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return an error when the value is not greater or equal to the specified value", () => {
    const validatorsConfig = {
      delta: {
        type: ["number", "The delta must be a number"],
        ge: [18, "The delta should be greater or equal to 18"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInputs = [
      { delta: -16 },
      { delta: 0 },
      { delta: -0.5 },
      { delta: 17.99 },
    ];
    const validInputs: any[] = [
      { delta: 19 },
      { delta: 30.5 },
      { delta: 400 },
      { delta: 18 },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "delta", error: "The delta should be greater or equal to 18" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return an error when the value is not equal to the specified value", () => {
    const validatorsConfig = {
      delta: {
        type: ["number", "The delta must be a number"],
        eq: [18, "The delta should be equal to 18"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInputs = [
      { delta: -16 },
      { delta: 0 },
      { delta: -0.5 },
      { delta: 17.99 },
      { delta: 20000 },
      { delta: -1799 },
    ];
    const validInput = { delta: 18 };

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "delta", error: "The delta should be equal to 18" },
      ]);
    });

    let result = validator.validate(validInput);
    expect(result).to.eql([]);
  });

  it("Shoud return an error when the value is not an integer", () => {
    const validatorsConfig = {
      delta: {
        type: ["number", "The delta must be a number"],
        integer: ["The delta should be an integer"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInputs = [
      { delta: -1.66 },
      { delta: -0.5 },
      { delta: 17.99 },
      { delta: -17.99 },
    ];
    const validInputs: any[] = [
      { delta: -19 },
      { delta: 305 },
      { delta: -400 },
      { delta: 18 },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "delta", error: "The delta should be an integer" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return an error when the value is not between the  min and max value specified", () => {
    const validatorsConfig = {
      delta: {
        type: ["number", "The delta must be a number"],
        btw: [-18, 3, "The delta should be a value between -18 and 3"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const validInputs = [
      { delta: -16 },
      { delta: 0 },
      { delta: -0.5 },
      { delta: 3 },
    ];
    const invalidInputs: any[] = [
      { delta: -18.5 },
      { delta: 3.1 },
      { delta: 4 },
      { delta: 1800 },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        {
          field: "delta",
          error: "The delta should be a value between -18 and 3",
        },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error for each invalid field", () => {
    const validatorsConfig = {
      delta: {
        type: ["number", "The delta must be a number"],
        btw: [-18, 3, "The delta should be a value between -18 and 3"],
      },
      age: {
        type: ["number", "The age must be a number"],
        ge: [18, "Adult only"],
      },
      size: {
        type: ["number", "The delta must be a number"],
        required: ["The size is required"],
      },
    };

    const validator = createValidator(validatorsConfig);
    let invalidInput = {
      delta: 4,
      age: 17,
    };
    let result = validator.validate(invalidInput);
    expect(result).to.have.deep.members([
      {
        field: "delta",
        error: "The delta should be a value between -18 and 3",
      },
      {
        field: "age",
        error: "Adult only",
      },
      {
        field: "size",
        error: "The size is required",
      },
    ]);

    let validInput = {
      delta: 2,
      age: 30,
      size: 1,
    };
    result = validator.validate(validInput);

    expect(result).to.eql([]);
  });
});
