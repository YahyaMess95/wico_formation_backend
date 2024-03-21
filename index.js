const express = require("express");
const server = express();
const cors = require("cors");
const logger = require("./config/logger");
const publicRoutes = require("./routes/publicRoutes");
const userRoutes = require("./routes/userRoutes");
const contenuRoutes = require("./routes/contenuRoutes");
const formationRoutes = require("./routes/formationRoutes");
const seanceRoutes = require("./routes/seanceRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const temoignageRoutes = require("./routes/temoignageRoutes");
const photoRoutes = require("./routes/photoRoutes");
const auth = require("./middleware/auth");
const path = require("path");

server.use((req, res, next) => {
  next();
});

server.use(
  cors({
    origin: "*",
  })
);

server.use(express.json());
server.use("/uploads", express.static(path.join(__dirname, "uploads")));
//  routes
server.use("/user", userRoutes);
server.use("/public", publicRoutes);
server.use("/contenu", auth, contenuRoutes);
server.use("/formation", auth, formationRoutes);
server.use("/seance", auth, seanceRoutes);
server.use("/session", auth, sessionRoutes);
server.use("/temoignage", auth, temoignageRoutes);
server.use("/photo", auth, photoRoutes);

server.listen(3000, function check(error) {
  if (error) {
    logger.info("Server Start has Error");
  } else {
    logger.info("Server is running on port 3000");
  }
});
