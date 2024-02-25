const express = require("express");
const server = express();
const cors = require("cors");
const logger = require("./config/logger");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contenuRoutes = require("./routes/contenuRoutes");
const formationRoutes = require("./routes/formationRoutes");
const seanceRoutes = require("./routes/seanceRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const temoignageRoutes = require("./routes/temoignageRoutes");
const auth = require("../middleware/auth");

server.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.url}`);
  next();
});

server.use(
  cors({
    origin: "https://main--lively-marshmallow-4c8289.netlify.app",
  })
);

server.use(express.json());

server.use("/user", userRoutes);
server.use("/public", adminRoutes);
server.use("/contenu", auth, contenuRoutes);
server.use("/formation", auth, formationRoutes);
server.use("/seance", auth, seanceRoutes);
server.use("/session", auth, sessionRoutes);
server.use("/temoignage", auth, temoignageRoutes);

server.listen(3000, function check(error) {
  if (error) {
    logger.info("Server Start has Error");
  } else {
    logger.info("Server is running on port 3000");
  }
});
