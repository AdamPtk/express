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
  async (req, res) => {
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
      query: { username },
    } = req;

    let users;
    if (username) {
      users = await User.find({ username: { $regex: username } });
      return res.send(users);
    }
    users = await User.find({});
    return res.send(users);
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

router.get("/api/users/:id", async (req, res) => {
  const {
    params: { id },
  } = req;

  const findUser = await User.findById(id);
  if (findUser === -1) return res.sendStatus(404);

  return res.send(findUser);
});

router.put(
  "/api/users/:id",
  checkSchema(updateUserValidationSchema),
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const {
      params: { id },
    } = req;
    const data = matchedData(req);

    try {
      const updatedUser = await User.findOneAndReplace({ _id: id }, data, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
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
