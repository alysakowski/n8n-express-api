import "dotenv/config";
import path from "path";
import express from "express";
import dataSnapshotRoutes from "./routes/data-snapshot";
import farmerInputsRoutes from "./routes/farmer-inputs";
import fieldStatusRoutes from "./routes/field-status";
import processRunRoutes from "./routes/process-run";
import remoteSensingRoutes from "./routes/remote-sensing";
import viewsRoutes from "./routes/views";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Set up EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(viewsRoutes);
app.use(farmerInputsRoutes);
app.use(remoteSensingRoutes);
app.use(processRunRoutes);
app.use(dataSnapshotRoutes);
app.use(fieldStatusRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  console.log(`Views:`);
  console.log(`  - http://localhost:${PORT}`);

  console.log(`API endpoints:`);
  console.log(`  - GET http://localhost:${PORT}/api/farmer-inputs`);
  console.log(`  - GET http://localhost:${PORT}/api/farmer-inputs/:fieldId`);
  console.log(`  - GET http://localhost:${PORT}/api/remote-sensing`);
  console.log(`  - GET http://localhost:${PORT}/api/remote-sensing/:fieldId`);
  console.log(`  - POST http://localhost:${PORT}/api/process-run/:fieldId`);
  console.log(`  - PUT http://localhost:${PORT}/api/process-run/:id`);
  console.log(`  - POST http://localhost:${PORT}/api/data-snapshot`);
  console.log(`  - PUT http://localhost:${PORT}/api/field-status`);
});
