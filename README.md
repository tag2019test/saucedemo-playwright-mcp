## Saucedemo Playwright MCP Framework

A modern, TypeScript-based Playwright automation framework for `https://www.saucedemo.com`, designed with clean architecture, Page Object Model, and Playwright MCP-assisted selector discovery.

### Tech stack

- **Runtime**: Node.js >= 20
- **Test runner**: Playwright Test (TypeScript)
- **Language**: TypeScript
- **Config**: dotenv
- **Quality**: ESLint + Prettier
- **CI**: GitHub Actions

### Project structure

- `pages/` – Page Object Model classes
  - `base.page.ts` – shared page behavior
  - `login.page.ts` – login page locators and actions
  - `inventory.page.ts` – inventory page locators and actions
- `tests/` – Playwright test specs
  - `login.spec.ts` – login flow tests
  - `inventory.spec.ts` – inventory and cart tests
- `utils/env.ts` – environment variable loading and typing
- `playwright.config.ts` – Playwright configuration (HTML reporter, tracing, CI retries, parallelism)
- `.github/workflows/playwright.yml` – GitHub Actions CI workflow

### Environment variables

The framework uses `dotenv` and expects these variables:

- `BASE_URL` – base URL of the application under test
- `USERNAME` – username for login
- `PASSWORD` – password for login

Copy `.env.example` to `.env` and adjust values as needed:

```bash
cp .env.example .env
```

> `.env` is ignored by git; do not commit secrets.

### Installation

```bash
npm install
npx playwright install --with-deps
```

### Running tests

- **All tests (headless)**:

```bash
npm test
```

- **Headed mode for debugging**:

```bash
npm run test:headed
```

### Architecture and best practices

- **Page Object Model (POM)**: one page object per page; page objects expose locators and actions only, while tests own assertions.
- **Selectors**:
  - Prefer `getByRole`, `getByLabel`, and `getByText` for robust, accessible locators.
  - Use `data-test` attributes via `getByTestId` when roles/labels are insufficient (configured through `testIdAttribute` in `playwright.config.ts`).
- **Tests**:
  - Use descriptive test names and `beforeEach` to keep tests isolated and readable.
  - Assertions live in spec files for clarity and maintainability.

### CI with GitHub Actions

The workflow in `.github/workflows/playwright.yml`:

- checks out the repository
- sets up Node.js 20
- installs dependencies and Playwright browsers
- runs the test suite
- uploads the HTML report as an artifact

Credentials (`USERNAME` and `PASSWORD`) should be provided via GitHub secrets `SAUCEDEMO_USERNAME` and `SAUCEDEMO_PASSWORD`.

