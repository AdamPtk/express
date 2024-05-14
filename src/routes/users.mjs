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
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

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
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const data = matchedData(req);
    const newUser = { id: usersMock[usersMock.length - 1].id + 1, ...data };
    usersMock.push(newUser);

    return res.status(201).send(newUser);
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
