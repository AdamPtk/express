// import { getUserByIdHandler } from "../handlers/users.mjs";
import { createUserHandler } from "../handlers/users.mjs";

jest.mock("express-validator", () => {
  return {
    validationResult: jest.fn(() => ({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: "Invalid field" }]),
    })),
  };
});

// const mockRequest = {
//   params: { id: "6656c388d0368ede524bcf5a" },
// };

const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

// describe("get user", () => {
//   test("should get user by id", async () => {
//     await getUserByIdHandler(mockRequest, mockResponse);
//     expect(mockResponse.send).toHaveBeenCalled();
//   }, 5000);
// });

describe("create user", () => {
  const mockRequest = {
    // body: {
    //   username: "test",
    //   password: "password",
    //   email: "",
    // },
  };

  it("should return status 400 when there are errors", async () => {
    await createUserHandler(mockRequest, mockResponse);
  });
});
