import { User } from "../mongoose/schemas/user.mjs";

export const resolveIndexByUserId = async (req, res, next) => {
  const {
    params: { id },
  } = req;

  const findUserIndex = await User.findById(id);
  if (findUserIndex === -1) return res.sendStatus(404);

  next();
};
