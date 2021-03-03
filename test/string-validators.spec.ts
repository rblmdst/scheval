import { expect } from "chai";
import { createValidator } from "../src/index";

/* const validatorsConfig = {
  name: {
    type: ["string", "The name must be a string"],
    required: ["The name is required"],
    min: [2, "The name must consist of 2 caracters minimum"],
    max: [30, "The name must consist of 30 caracters maximum"],
    enum: [["M", "F"], "Take value M or F"],
    match: [/^\d{2}-\d{2}-\d{2}$/, "is not a valid date"],
    email: ["Invalid email"],
  },
  sex: {
    required: ["The name is required"],
    type: ["string", "The name must be a string"],
    enum: [["M", "F"], "Take value M or F"],
  },
  date: {
    required: ["The name is required"],
    type: ["string", "The name must be a string"],
    match: [/^\d{2}-\d{2}-\d{2}$/, "is not a valid date"],
  },
  emailAddress: {
    required: ["The name is required"],
    type: ["string", "The name must be a string"],
    email: ["Invalid email"],
    max: [30, "The email address must consist of 30 caracters maximum"],
  },
}; */

describe("String validators", () => {
  it("Should return an error when the value is not a string", () => {
    const validatorsConfig = {
      name: {
        type: ["string", "The name must be a string"],
      },
    };
    const validator = createValidator(validatorsConfig);
    const validInput = { name: "test" };
    const invalidInputs: any[] = [
      { name: 4 },
      { name: [] },
      { name: {} },
      { name: true },
      { name: false },
    ];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "name", error: "The name must be a string" },
      ]);
    });

    let result = validator.validate(validInput);
    expect(result).to.eql([]);
  });

  it("Should return an error when the value is required but the value  undefined, empty string or null is passed as value", () => {
    const validatorsConfig = {
      name: {
        type: ["string", "The name must be a string"],
        required: ["The name is required"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInput = { name: "test" };
    const invalidInputs: any[] = [
      { name: null },
      { name: undefined },
      {},
      { name: "" },
    ];
    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([{ field: "name", error: "The name is required" }]);
    });

    const result = validator.validate(validInput);
    expect(result).to.eql([]);
  });

  it("Should not return an error when the value is optional and undefined, empty string, or null is passed as value", () => {
    const validatorsConfig = {
      name: {
        type: ["string", "The name must be a string"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInputs: any[] = [
      { name: null },
      { name: undefined },
      {},
      { name: "" },
    ];
    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error when the string length is greater than the max allowed", () => {
    const validatorsConfig = {
      name: {
        type: ["string", "The name must be a string"],
        max: [3, "The name must consist of 3 caracters maximum"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const invalidInput = { name: "test" };
    const validInputs = [{ name: "te" }, { name: "tes" }];

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });

    const result = validator.validate(invalidInput);
    expect(result).to.eql([
      { field: "name", error: "The name must consist of 3 caracters maximum" },
    ]);
  });

  it("Should return an error when the string length is lower than the min allowed", () => {
    const validatorsConfig = {
      name: {
        type: ["string", "The name must be a string"],
        min: [3, "The name must consist of 3 caracters minimum"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const validInputs = [{ name: "tes" }, { name: "testing" }];
    const invalidInputs = [{ name: "t" }, { name: "te" }];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        {
          field: "name",
          error: "The name must consist of 3 caracters minimum",
        },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error when the value is not a valid email", () => {
    const validatorsConfig = {
      email: {
        type: ["string", "The email must be a string"],
        email: ["Invalid email"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const invalidInputs = [
      { email: "test" },
      { email: "tes@" },
      { email: "tes@test" },
      { email: "tes@test." },
      { email: "tes@test.t" },
    ];
    const validInputs = [{ email: "tes@test.co" }, { email: "te@test.xyz" }];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([{ field: "email", error: "Invalid email" }]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error when the value does not match the regex specified", () => {
    const validatorsConfig = {
      date: {
        type: ["string", "The email must be a string"],
        match: [/^\d{2}-\d{2}-\d{4}$/, "The date format is DD-MM-YYYY"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const invalidInputs = [
      { date: "test" },
      { date: "dd-mm-2020" },
      { date: "2020-02-12" },
      { date: "02-2020-10" },
      { date: "00 00 0000" },
    ];
    const validInputs = [{ date: "02-02-2001" }, { date: "00-00-0000" }];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "date", error: "The date format is DD-MM-YYYY" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error when the value does not match the regex specified", () => {
    const validatorsConfig = {
      sex: {
        type: ["string", "The email must be a string"],
        enum: [["M", "F"], "Sex can take value 'M' or 'F'"],
      },
    };
    const validator = createValidator(validatorsConfig);

    const invalidInputs = [
      { sex: "m" },
      { sex: "f" },
      { sex: "masculine" },
      { sex: "feminine" },
      { sex: "" },
    ];
    const validInputs = [{ sex: "M" }, { sex: "F" }];

    invalidInputs.forEach((invalidInput) => {
      let result = validator.validate(invalidInput);
      expect(result).to.eql([
        { field: "sex", error: "Sex can take value 'M' or 'F'" },
      ]);
    });

    validInputs.forEach((validInput) => {
      let result = validator.validate(validInput);
      expect(result).to.eql([]);
    });
  });

  it("Should return an error for each invalid field", () => {
    const validatorsConfig = {
      name: {
        type: ["string", "The name must be a string"],
        required: ["The name is required"],
        min: [5, "The name must consist of 5 caracters minimum"],
        max: [30, "The name must consist of 30 caracters maximum"],
      },
      sex: {
        required: ["The name is required"],
        type: ["string", "The name must be a string"],
        enum: [["M", "F"], "Take value M or F"],
      },
      date: {
        type: ["string", "The name must be a string"],
        match: [/^\d{2}-\d{2}-\d{2}$/, "is not a valid date"],
      },
      email: {
        required: ["The name is required"],
        type: ["string", "The name must be a string"],
        email: ["Invalid email"],
        max: [15, "The email address must consist of 15 caracters maximum"],
      },
    };
    const validator = createValidator(validatorsConfig);

    let invalidInput = {
      email: "test@testing.testing",
      sex: "m",
      name: "Abc",
    };

    let result = validator.validate(invalidInput);
    expect(result).to.have.deep.members([
      { field: "sex", error: "Take value M or F" },
      {
        field: "email",
        error: "The email address must consist of 15 caracters maximum",
      },
      {
        field: "name",
        error: "The name must consist of 5 caracters minimum",
      },
    ]);

    const validInput = {
      email: "ab@test.co",
      sex: "M",
      name: "testing",
    };
    result = validator.validate(validInput);
    expect(result).to.eql([]);
  });
});
