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

server.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.url}`);
  next();
});

 

server.use(express.json());

server.use("/user", userRoutes);
server.use("/admin", adminRoutes);
server.use("/contenu", contenuRoutes);
server.use("/formation", formationRoutes);
server.use("/seance", seanceRoutes);
server.use("/session", sessionRoutes);
server.use("/temoignage", temoignageRoutes);

server.listen(3000, function check(error) {
  if (error) {
    logger.info("Server Start has Error");
  } else {
    logger.info("Server is running on port 3000");
  }
});
