import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import routes from './routes/index.mjs';
import { usersMock } from './utils/constants.mjs';
import './strategies/local-strategy.mjs';

const app = express();

app.use(express.json());
app.use(cookieParser('helloworld'));
app.use(
  session({
    secret: 'adamptk',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post('/api/auth', passport.authenticate('local'), (req, res) => {});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Listening on port 3000');
});

app.get('/', (req, res) => {
  req.session.visited = true;
  console.log(req.session);
  console.log(req.session.id);
  res.cookie('hello', 'world', { maxAge: 30000, signed: true });
  res.status(200).send({ msg: 'Yo' });
});
