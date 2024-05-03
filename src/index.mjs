import express from "express";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express();

app.use(express.json());

// const loggingMiddleware = (req, res, next) => {
//   console.log(`${req.method} - ${req.url}`);
//   next();
// };

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad request. Invalid id" });

  const findUserIndex = usersMock.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);

  req.findUserIndex = findUserIndex;

  next();
};

// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

const usersMock = [
  { id: 1, username: "harry", displayName: "Harry" },
  { id: 2, username: "anton", displayName: "Anton" },
  { id: 3, username: "tommy", displayName: "Tommy" },
  { id: 4, username: "claude", displayName: "Claude" },
  { id: 5, username: "ron", displayName: "Ron" },
  { id: 6, username: "elias", displayName: "Elias" },
];

app.get(
  "/",
  (req, res, next) => {
    console.log("Base URL");
    next();
  },
  (req, res) => {
    res.status(200).send({ msg: "Ello" });
  }
);

app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 12 })
    .withMessage("Must be at least 3-12 characters"),
  (req, res) => {
    const result = validationResult(req);
    const {
      query: { filter, value },
    } = req;

    if (filter && value)
      return res.send(usersMock.filter((user) => user[filter].includes(value)));

    return res.send(usersMock);
  }
);

app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  const data = matchedData(req);
  const newUser = { id: usersMock[usersMock.length - 1].id + 1, ...data };
  usersMock.push(newUser);

  return res.status(201).send(newUser);
});

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  const findUser = usersMock[findUserIndex];
  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([
    { id: 1, name: "tshirt", price: 59.99 },
    { id: 2, name: "hoodie", price: 99.99 },
    { id: 3, name: "jumper", price: 79.99 },
  ]);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  usersMock[findUserIndex] = { id: usersMock[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  usersMock[findUserIndex] = { ...usersMock[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  usersMock.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Listening on port 3000");
});
