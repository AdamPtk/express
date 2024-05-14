import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

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
