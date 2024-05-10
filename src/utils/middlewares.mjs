import { usersMock } from "../utils/constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
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
