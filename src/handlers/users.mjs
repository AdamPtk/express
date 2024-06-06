import { matchedData, validationResult } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

export const getUserByIdHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const findUser = await User.findById(id);
  if (findUser === -1) return res.sendStatus(404);
  return res.send(findUser);
};

export const createUserHandler = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send(result.array());
  const data = matchedData(req);
  data.password = hashPassword(data.password);
  const newUser = new User(data);
  try {
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser);
  } catch (err) {
    return res.sendStatus(400);
  }
};
