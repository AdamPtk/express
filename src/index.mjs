import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { usersMock } from "./utils/constants.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "adamptk",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Listening on port 3000");
});

app.get("/", (req, res) => {
  req.session.visited = true;
  console.log(req.session);
  console.log(req.session.id);
  res.cookie("hello", "world", { maxAge: 30000, signed: true });
  res.status(200).send({ msg: "Yo" });
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;

  const findUser = usersMock.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return res.status(401).send({ msg: "BAD CREDENTIALS" });

  req.session.user = findUser;
  return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;
  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  return res.send(req.session.cart ?? []);
});
