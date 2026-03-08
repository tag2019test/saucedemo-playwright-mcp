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

Credentials and configuration should be provided via GitHub **repository secrets**:

- `BASE_URL` – e.g. `https://www.saucedemo.com`
- `SAUCEDEMO_USERNAME` – mapped to `USERNAME` in the workflow env
- `SAUCEDEMO_PASSWORD` – mapped to `PASSWORD` in the workflow env

In your GitHub repo go to **Settings → Secrets and variables → Actions**, then create these three secrets with the appropriate values. On each push or pull request to `main`/`master`, the workflow will inject them into the environment and run the tests using those values.

### Snapshot testing (ARIA + visual)

- **ARIA snapshots** (`tests/snapshots.spec.ts`):
  - `login page accessibility snapshot` uses `expect(locator).toMatchAriaSnapshot({ name: 'login-page.aria.yml' })`.
  - Baseline is stored under `tests/snapshots.spec.ts-snapshots/login-page.aria.yml`.
- **Visual snapshots**:
  - `inventory page visual snapshot` uses `expect(locator).toHaveScreenshot('inventory-container.png')`.
  - Baseline images are stored under `tests/snapshots.spec.ts-snapshots/` (per Playwright docs).

To (re)generate snapshots locally:

```bash
npx playwright test tests/snapshots.spec.ts --update-snapshots
```

### Updating snapshots for CI (Linux) with GitHub Actions

Because CI runs on Linux, Playwright expects Linux-specific snapshot files (for example `inventory-container-chromium-linux.png`). To generate and maintain these from CI, use the dedicated workflow in `.github/workflows/playwright-update-snapshots.yml`:

1. Push your changes, then in GitHub go to the **Actions** tab.
2. Select **Playwright Update Snapshots** and click **Run workflow**.
3. The job will:
   - run inside the official Playwright Docker image
   - execute `npx playwright test tests/snapshots.spec.ts --update-snapshots`
   - upload the updated `tests/snapshots.spec.ts-snapshots` folder as an artifact named `snapshots`.
4. Download that artifact locally, extract it into `tests/snapshots.spec.ts-snapshots/`, then:

```bash
git add tests/snapshots.spec.ts-snapshots/
git commit -m "test: update Playwright snapshots"
git push
```

Once these Linux snapshots are committed, the main CI workflows will use them and the snapshot tests will pass consistently.