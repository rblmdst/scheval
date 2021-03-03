import { expect } from "chai";
import { createValidator } from "../src/index";

describe("Object validators", () => {
  it("Shoud return an error when the value is not a object", () => {
    const validatorsConfig = {
      userInfos: {
        type: ["object", "The userInfos must be a object"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInputs = [
      { userInfos: 4 },
      { userInfos: -4 },
      { userInfos: 0 },
      { userInfos: +2 },
      { userInfos: 0.36 },
      { userInfos: -1.96 },
    ];
    const validInputs: any[] = [
      { userInfos: {} },
      { userInfos: { name: "test" } },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "userInfos", error: "The userInfos must be a object" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });
  it("Should return an error when the value is required but undefined or null is passed as value", () => {
    const validatorsConfig = {
      userInfos: {
        type: ["object", "The userInfos must be a object"],
        required: ["The userInfos is required"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInput = { userInfos: { age: 23 } };
    const invalidInputs: any[] = [
      { userInfos: null },
      { userInfos: undefined },
      {},
    ];
    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "userInfos", error: "The userInfos is required" },
      ]);
    });

    const result = validator.validate(validInput);
    expect(result).to.eql([]);
  });

  it("Should not return an error when the value is optional and undefined or null is passed as value", () => {
    const validatorsConfig = {
      userInfos: {
        type: ["object", "The userInfos must be a object"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInputs: any[] = [
      { userInfos: null },
      { userInfos: undefined },
      {},
    ];
    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error for each invalid field", () => {
    const validatorsConfig = {
      contact: {
        type: ["object", "The contact must be an object"],
      },
      userInfos: {
        type: ["object", "The userInfos must be an object"],
        required: ["The userInfos is required"],
      },
    };

    const validator = createValidator(validatorsConfig);
    let invalidInput = {
      contact: false,
    };
    let result = validator.validate(invalidInput);
    expect(result).to.have.deep.members([
      {
        field: "userInfos",
        error: "The userInfos is required",
      },
      {
        field: "contact",
        error: "The contact must be an object",
      },
    ]);

    let validInput = {
      userInfos: { name: "Nasa" },
    };
    result = validator.validate(validInput);

    expect(result).to.eql([]);
  });
});
