import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are an expert Playwright test engineer.
Given a natural language description of a UI test scenario, generate a valid Playwright test script in JavaScript.

Rules:
- Use @playwright/test (import { test, expect } from '@playwright/test')
- Always include proper assertions (expect)
- Use best practices: waitFor, locators, aria roles
- Output ONLY the raw JavaScript code — no markdown, no explanation
- Save screenshots on failure using: await page.screenshot({ path: 'failure.png' })
`;

const HEAL_PROMPT = `
You are an expert Playwright test engineer.
The following Playwright test script failed with the error below.
Fix the script so it passes. Output ONLY the corrected raw JavaScript code — no markdown, no explanation.
`;

export async function generateTest(userPrompt) {
  console.log("🧠 Generating test for:", userPrompt);
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });
  return response.choices[0].message.content;
}

async function healTest(scriptContent, errorOutput) {
  console.log("🩺 Attempting to self-heal the test...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: HEAL_PROMPT },
      {
        role: "user",
        content: `SCRIPT:\n${scriptContent}\n\nERROR:\n${errorOutput}`,
      },
    ],
    temperature: 0.2,
  });
  return response.choices[0].message.content;
}

export async function runTest(scriptContent, testName = "generated-test", maxRetries = 2) {
  const filePath = path.join("tests", `${testName}.spec.js`);
  fs.mkdirSync("tests", { recursive: true });

  let currentScript = scriptContent;
  let attempt = 0;

  while (attempt <= maxRetries) {
    fs.writeFileSync(filePath, currentScript);

    if (attempt === 0) {
      console.log(`✅ Test saved to: ${filePath}`);
      console.log("🚀 Running test...\n");
    } else {
      console.log(`🔁 Retry attempt ${attempt}/${maxRetries}...\n`);
    }

    try {
      execSync(`npx playwright test ${filePath} --reporter=list`, {
        stdio: "inherit",
      });
      console.log("\n🎉 Test passed!");
      return { success: true, script: currentScript, attempts: attempt + 1 };
    } catch (err) {
      const errorOutput =
        err.stdout?.toString() || err.stderr?.toString() || err.message;

      if (attempt < maxRetries) {
        console.error(`\n❌ Test failed on attempt ${attempt + 1}. Healing...`);
        currentScript = await healTest(currentScript, errorOutput);
        fs.writeFileSync(
          path.join("tests", `${testName}-healed-attempt${attempt + 1}.spec.js`),
          currentScript
        );
      } else {
        console.error("\n💀 Test failed after all healing attempts.");
        return {
          success: false,
          script: currentScript,
          attempts: attempt + 1,
          error: errorOutput,
        };
      }
    }

    attempt++;
  }
}

// CLI entry point
const userInput =
  process.argv[2] ||
  "Go to https://playwright.dev, verify the page title contains 'Playwright', and click the 'Get Started' link";

const script = await generateTest(userInput);
await runTest(script, "ai-generated-test");
