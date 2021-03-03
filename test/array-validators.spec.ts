import { expect } from "chai";
import { createValidator } from "../src/index";

describe("Array validators", () => {
  it("Shoud return error when the value is not an array", () => {
    const validatorsConfig = {
      users: {
        type: ["array", "The list must be an array"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const validInputs = [
      { users: [] },
      { users: ["user1"] },
      { users: ["user1", 0, false, Infinity, {}, true, -2.6] },
    ];
    const invalidInputs: any[] = [
      { users: Infinity },
      { users: {} },
      { users: +"ab" },
      { users: true },
      { users: false },
      { users: "" },
      { users: 4 },
      { users: -4 },
      { users: 0 },
      { users: +2 },
      { users: 0.36 },
      { users: -1.96 },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "users", error: "The list must be an array" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });
  it("Should return an error when the value is required but undefined or null is passed as value", () => {
    const validatorsConfig = {
      users: {
        type: ["array", "The users list must be an array"],
        required: ["The users list is required"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInput = { users: [] };
    const invalidInputs: any[] = [{ users: null }, { users: undefined }, {}];
    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "users", error: "The users list is required" },
      ]);
    });

    const result = validator.validate(validInput);
    expect(result).to.eql([]);
  });

  it("Should not return an error when the value is optional and undefined or null is passed as value", () => {
    const validatorsConfig = {
      users: {
        type: ["array", "The users list must be an array"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInputs: any[] = [{ users: null }, { users: undefined }, {}];
    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return error when the value is not an array of the specified type", () => {
    /* String */
    let validatorsConfig1 = {
      users: {
        type: ["array", "The list must be an array"],
        ofType: ["string", "The list must be an array of string"],
      },
    };
    let validator = createValidator(validatorsConfig1);
    let validInputs = [{ users: [] }, { users: ["user1", "user2"] }];
    let invalidInputs: any[] = [
      { users: ["user1", 0, false] },
      { users: [0, false] },
      { users: [0, false, "user2"] },
      { users: ["user3", 0, false, "user2"] },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "users", error: "The list must be an array of string" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });

    /* Number */
    let validatorsConfig2 = {
      users: {
        type: ["array", "The list must be an array"],
        ofType: ["number", "The list must be an array of number"],
      },
    };
    validator = createValidator(validatorsConfig2);
    let validInputs2 = [{ users: [] }, { users: [-29.92, 0, -1] }];
    invalidInputs = [
      { users: ["user1", 0, false] },
      { users: [0, false] },
      { users: [0, false, "user2"] },
      { users: ["user3", 0, false, "user2"] },
      { users: ["user1", "user2"] },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "users", error: "The list must be an array of number" },
      ]);
    });

    validInputs2.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });

    /* Boolean */
    let validatorsConfig3 = {
      users: {
        type: ["array", "The list must be an array"],
        ofType: ["boolean", "The list must be an array of boolean"],
      },
    };
    validator = createValidator(validatorsConfig3);
    let validInputs3 = [{ users: [] }, { users: [false, true, false, false] }];
    invalidInputs = [
      { users: ["user1", 0, false] },
      { users: [0, false] },
      { users: [0, 3, 4, -1] },
      { users: [0, false, "user2"] },
      { users: ["user3", 0, false, "user2"] },
      { users: ["user1", "user2"] },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "users", error: "The list must be an array of boolean" },
      ]);
    });

    validInputs3.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });

    /* Object */
    let validatorsConfig4 = {
      users: {
        type: ["array", "The list must be an array"],
        ofType: ["object", "The list must be an array of object"],
      },
    };
    validator = createValidator(validatorsConfig4);
    let validInputs4 = [
      { users: [] },
      { users: [{ age: 12 }, { updated: false }, { name: "test" }, {}] },
    ];
    invalidInputs = [
      { users: ["user1", 0, false] },
      { users: [0, false] },
      { users: [0, 3, 4, -1] },
      { users: [0, false, "user2"] },
      { users: ["user3", 0, false, "user2"] },
      { users: ["user1", "user2"] },
      { users: [false, true, false, false] },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "users", error: "The list must be an array of object" },
      ]);
    });

    validInputs4.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return error when the size of the array passed is not greater or equal the minimum size of array specified ", () => {
    const validatorsConfig = {
      users: {
        type: ["array", "The list must be an array"],
        ofMinSize: [3, "At least 3 users"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInputs = [
      { users: [] },
      { users: ["user1"] },
      { users: ["user1", "user2"] },
    ];
    const validInputs: any[] = [
      { users: ["user1", "user2", "user3"] },
      { users: ["user1", "user2", 0, 12] },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([{ field: "users", error: "At least 3 users" }]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return error when the size of the array passed is not lower or equal the maximum size of array specified ", () => {
    const validatorsConfig = {
      users: {
        type: ["array", "The list must be an array"],
        ofMaxSize: [3, "At most 3 users"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const validInputs = [
      { users: [] },
      { users: ["user1"] },
      { users: ["user1", "user2"] },
    ];
    const invalidInputs: any[] = [
      { users: ["user1", "user2", "user3", "user4"] },
      { users: ["user1", "user2", 0, 12] },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([{ field: "users", error: "At most 3 users" }]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Shoud return error when the size of the array passed is not equal to the size of array specified ", () => {
    const validatorsConfig = {
      users: {
        type: ["array", "The list must be an array"],
        ofSize: [3, "3 users exactly"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInputs = [
      { users: [] },
      { users: ["user1"] },
      { users: ["user1", "user2"] },
      { users: ["user1", "user2", "user3", "user4"] },
    ];
    const validInputs: any[] = [
      { users: ["user1", 0, 12] },
      { users: ["user1", "user2", "user3"] },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([{ field: "users", error: "3 users exactly" }]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error for each invalid field", () => {
    const validatorsConfig = {
      users: {
        type: ["array", "The list must be an array"],
        ofSize: [2, "2 users exactly"],
      },
      coords: {
        type: ["array", "The list must be an array"],
        ofType: ["number", "An array of number"],
      },
      list: {
        type: ["array", "The list must be an array"],
        required: ["the value is required"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const invalidInput = {
      users: ["user1", "user2", "user3"],
      coords: [2, "3"],
      list: null,
    };
    const validInput = {
      users: ["user1", "user2"],
      coords: [23, 2.33],
      list: [],
    };
    let result = validator.validate(invalidInput);

    expect(result).to.have.deep.members([
      {
        field: "users",
        error: "2 users exactly",
      },
      {
        field: "coords",
        error: "An array of number",
      },
      {
        field: "list",
        error: "the value is required",
      },
    ]);

    result = validator.validate(validInput);

    expect(result).to.eql([]);
  });
});
