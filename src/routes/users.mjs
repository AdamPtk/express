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
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";

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
  createUserHandler
);

router.get("/api/users/:id", getUserByIdHandler);

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
      const updatedUser = await User.findOneAndUpdate({ _id: id }, data, {
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

export default router;
