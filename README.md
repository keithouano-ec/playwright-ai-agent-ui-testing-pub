# 🤖 Playwright AI Test Agent

> Generate, run, and **self-heal** UI tests from plain English — powered by OpenAI GPT-4o + Playwright.

![CI](https://github.com/keithouano-ec/playwright-ai-agent-ui-testing-pub/actions/workflows/ci.yml/badge.svg)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Test Generation** | Describe a test in plain English → GPT-4o writes the Playwright script |
| 🩺 **Self-Healing** | If a test fails, the agent automatically asks GPT-4o to fix it (up to 2 retries) |
| 🌐 **Web UI** | Clean dark-mode interface — no coding needed to run tests |
| 🗂️ **Test History** | Browse and view all previously generated test scripts |
| ⚙️ **CI/CD Pipeline** | GitHub Actions runs tests automatically on every push/PR |

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/keithouano-ec/playwright-ai-agent-ui-testing-pub.git
cd playwright-ai-agent-ui-testing-pub
```

### 2. Install dependencies
```bash
npm install
npx playwright install
```

### 3. Set up environment
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 4. Start the Web UI
```bash
npm start
# Open http://localhost:3000
```

---

## 🖥️ Web UI Usage

1. Open **http://localhost:3000**
2. Enter an optional **Test Name**
3. Type your **test scenario** in plain English
4. Click **Generate & Run Test**
5. Watch the AI generate, run, and self-heal the test in real-time!

### Example prompts:
```
Go to https://github.com, search for 'playwright', and verify the first result appears
```
```
Go to https://example.com and verify the heading says 'Example Domain'
```
```
Go to https://playwright.dev, click 'Get Started', and verify the URL changes
```

---

## 🤖 CLI Usage

```bash
node agent/testAgent.js "Go to https://playwright.dev and verify the title contains Playwright"
```

---

## ⚙️ CI/CD — GitHub Actions

The pipeline runs automatically on:
- **Push** to `main` or `develop`
- **Pull Requests** to `main`
- **Manual trigger** (with custom test prompt)

### Setup: Add your OpenAI API Key as a secret

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `OPENAI_API_KEY`
4. Value: your OpenAI API key

### Manual trigger with custom prompt:
1. Go to **Actions** tab
2. Select **🤖 Playwright AI Agent CI**
3. Click **Run workflow**
4. Enter your test scenario prompt
5. Click **Run workflow** ✅

---

## 📁 Project Structure

```
playwright-ai-agent-ui-testing-pub/
├── agent/
│   └── testAgent.js          # Core AI agent: generate + self-heal
├── server/
│   └── index.js              # Express API server
├── public/
│   └── index.html            # Web UI (dark mode)
├── tests/                    # Auto-generated test files
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI/CD pipeline
├── playwright.config.js
├── .env.example
└── package.json
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI API key |
| `PORT` | No | Server port (default: 3000) |

---

## 📄 License

MIT
