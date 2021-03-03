import { expect } from "chai";
import { createValidator } from "../src/index";

describe("Boolean validators", () => {
  it("Shoud return an error when the value is not a boolean", () => {
    const validatorsConfig = {
      isAdmin: {
        type: ["boolean", "The isAdmin must be a boolean"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInputs = [
      { isAdmin: 4 },
      { isAdmin: -4 },
      { isAdmin: 0 },
      { isAdmin: +2 },
      { isAdmin: 0.36 },
      { isAdmin: -1.96 },
      { isAdmin: "" },
      { isAdmin: "false" },
      { isAdmin: "true" },
      { isAdmin: {} },
    ];
    const validInputs: any[] = [{ isAdmin: true }, { isAdmin: false }];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "isAdmin", error: "The isAdmin must be a boolean" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });
  it("Should return an error when the value is required but undefined or null is passed as value", () => {
    const validatorsConfig = {
      isAdmin: {
        type: ["boolean", "The isAdmin must be a boolean"],
        required: ["The isAdmin is required"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInputs = [{ isAdmin: true }, { isAdmin: false }];
    const invalidInputs: any[] = [
      { isAdmin: null },
      { isAdmin: undefined },
      {},
    ];
    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "isAdmin", error: "The isAdmin is required" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should not return an error when the value is optional and undefined or null is passed as value", () => {
    const validatorsConfig = {
      isAdmin: {
        type: ["boolean", "The isAdmin must be a boolean"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInputs: any[] = [{ isAdmin: null }, { isAdmin: undefined }, {}];
    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error for each invalid field", () => {
    const validatorsConfig = {
      active: {
        type: ["boolean", "The active value must be an boolean"],
      },
      isAdmin: {
        type: ["boolean", "The value must be an boolean"],
        required: ["The isAdmin field is required"],
      },
    };

    const validator = createValidator(validatorsConfig);
    let invalidInput = {
      active: "false",
    };
    let result = validator.validate(invalidInput);
    expect(result).to.have.deep.members([
      {
        field: "isAdmin",
        error: "The isAdmin field is required",
      },
      {
        field: "active",
        error: "The active value must be an boolean",
      },
    ]);

    let validInput = { isAdmin: false };

    result = validator.validate(validInput);

    expect(result).to.eql([]);
  });
});
