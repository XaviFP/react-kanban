import mongoose from "mongoose";
import { initDb } from "./db/initMongoDb.js";
import { app, server } from "./httpServer.js";
import dbConfig from "./db/dbConfig.js";

import boardRoutes from "./boards/routes.js";
import sessionRoutes from "./sessions/routes.js";

mongoose
  .connect(dbConfig.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    initDb();
    console.log("MongoDB connected...");
  })
  .then(console.log("MongoDB initialized..."))
  .catch((err) => {
    console.log(err);
  });

// Register routes
app.use("/boards", boardRoutes);
app.use("/session", sessionRoutes);

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));
