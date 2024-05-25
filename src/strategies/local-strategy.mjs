import passport from 'passport';
import { Strategy } from 'passport-local';
import { usersMock } from '../utils/constants.mjs';

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`Username: ${username}`);
    console.log(`passworddd: ${password}`);
    try {
      const findUser = usersMock.find((user) => user.username === username);
      if (!findUser) throw new Error('User not found');
      if (findUser.password !== password)
        throw new Error('Invalid credentials');
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  }),
);
