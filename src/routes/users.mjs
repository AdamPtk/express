import { Router } from "express";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  createUserValidationSchema,
  modifyUserValidationSchema,
  updateUserValidationSchema,
} from "../utils/validationSchemas.mjs";
import { usersMock } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 12 })
    .withMessage("Must be at least 3-12 characters"),
  (req, res) => {
    console.log(req.sessionID);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    const result = validationResult(req);
    const {
      query: { filter, value },
    } = req;

    if (filter && value)
      return res.send(usersMock.filter((user) => user[filter].includes(value)));

    return res.send(usersMock);
  }
);
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) return res.send(result.array());

    const data = matchedData(req);
    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return res.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  }
);

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  const findUser = usersMock[findUserIndex];
  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

router.put(
  "/api/users/:id",
  checkSchema(updateUserValidationSchema),
  resolveIndexByUserId,
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const data = matchedData(req);
    const { findUserIndex } = req;

    usersMock[findUserIndex] = { id: usersMock[findUserIndex].id, ...data };
    return res.sendStatus(200);
  }
);

router.patch(
  "/api/users/:id",
  checkSchema(modifyUserValidationSchema),
  resolveIndexByUserId,
  (req, res) => {
    const { body, findUserIndex } = req;

    usersMock[findUserIndex] = { ...usersMock[findUserIndex].id, ...body };
    return res.sendStatus(200);
  }
);

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  usersMock.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

export default router;
