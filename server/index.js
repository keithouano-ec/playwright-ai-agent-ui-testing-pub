import express from "express";
import cors from "cors";
import { generateTest, runTest } from "../agent/testAgent.js";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// POST /api/run-test
app.post("/api/run-test", async (req, res) => {
  const { prompt, testName } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const safeName = (testName || `test-${Date.now()}`).replace(/\s+/g, "-");

  try {
    const script = await generateTest(prompt);
    const result = await runTest(script, safeName, 2);
    res.json({
      success: result.success,
      script: result.script,
      attempts: result.attempts,
      error: result.error || null,
      testFile: `tests/${safeName}.spec.js`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tests — list all generated test files
app.get("/api/tests", (req, res) => {
  const testsDir = path.join(process.cwd(), "tests");
  if (!fs.existsSync(testsDir)) return res.json([]);
  const files = fs.readdirSync(testsDir).filter((f) => f.endsWith(".spec.js"));
  res.json(files);
});

// GET /api/tests/:filename — get script content
app.get("/api/tests/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "tests", req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Not found" });
  res.json({ content: fs.readFileSync(filePath, "utf-8") });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server running at http://localhost:${PORT}`));
