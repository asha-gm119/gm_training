import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import alertsRouter from "./routes/alerts.js";

app.use("/api/alerts", alertsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
