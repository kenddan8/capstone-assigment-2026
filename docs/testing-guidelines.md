# Testing Guidelines

## Purpose

These guidelines define the project's standards for automated unit and end-to-end testing. All test code, test helpers, fixtures, and test configuration shall be written in TypeScript.

## Testing Tools

### Unit and Component Tests

- Use Vitest as the test runner for unit and component tests.
- Use React Testing Library for tests that render React components.
- Use `@testing-library/user-event` to simulate user interactions.
- Use `@testing-library/jest-dom` for accessible DOM assertions.
- Run unit tests in a DOM-compatible Vitest environment when browser APIs are required.

### End-to-End Tests

- Use Playwright for end-to-end tests.
- Run the end-to-end suite against Playwright's Chromium browser project.
- Test the application through its rendered user interface rather than internal component state or implementation details.
- Keep browser, base URL, web server, retries, screenshots, traces, and other shared options in the Playwright configuration.

## File Naming and Organization

- Name every test file after the behavior, component, service, or workflow it verifies.
- Use specific names that allow a developer to understand the test's scope without opening the file.
- Do not use generic names such as `test.test.ts`, `app-tests.ts`, or `misc.spec.ts`.
- Name unit and component test files with the `.test.ts` or `.test.tsx` suffix.
- Name Playwright end-to-end test files with the `.spec.ts` suffix.
- Use `.tsx` only when the test file itself contains JSX.

Examples:

| Test scope | Recommended filename |
| --- | --- |
| Weather API client | `weather-api.test.ts` |
| Outfit generation logic | `outfit-generator.test.ts` |
| Weather notes component | `weather-notes.test.tsx` |
| Initial outfit generation workflow | `generate-outfit.spec.ts` |
| Outfit regeneration workflow | `regenerate-outfit.spec.ts` |

Place unit and component tests next to the source file they test, unless a feature already has an established test directory. Place Playwright tests in a top-level `e2e/` directory.

## Test Structure

- Organize tests around observable behavior using clear `describe` and `it` or `test` descriptions.
- Follow the arrange, act, assert pattern within each test.
- Test one behavior or outcome per test case.
- Keep tests deterministic and independent so they can run in any order.
- Reset mocks, fake timers, modified globals, and test data between tests.
- Prefer user-visible queries such as role, accessible name, label, and text over CSS selectors or test IDs.
- Use test IDs only when no stable accessible selector is available.

## Unit Testing Scope

Unit and component tests shall cover, as applicable:

- Weather data parsing, formatting, and error handling.
- Atlanta date and time formatting with the `America/New_York` time zone.
- Outfit selection logic for different weather conditions.
- Weather-change note generation.
- Loading, success, empty, and error states.
- Initial generation and regeneration interactions.
- Prevention of duplicate generation requests while loading.

Mock external boundaries such as weather services, outfit services, time, and network requests. Do not mock the behavior being tested.

## End-to-End Testing Scope

Playwright tests shall verify the application's critical user workflows in Chromium:

- The page displays Atlanta weather and local time.
- The weather-change note is visible and updates with the weather data.
- The bright-red generation button changes to a spinning loading indicator.
- A generated outfit includes item suggestions and working external links.
- The `Regenerate` button renders a new outfit suggestion.
- Loading and error states allow the user to recover without reloading the page.
- Primary workflows remain usable at representative desktop and mobile viewport sizes.

Use controlled API responses through Playwright request interception for deterministic weather and outfit scenarios. Keep a small number of separate integration checks for real services only when credentials and a stable test environment are available.

## Quality Requirements

- Every bug fix shall include a regression test when the behavior can be automated reliably.
- New business logic shall include unit tests.
- New or changed critical user workflows shall include or update an end-to-end test.
- Tests shall not depend on execution order, live production data, or arbitrary time delays.
- Use Playwright's automatic waiting and assertions instead of fixed sleeps.
- The Vitest and Playwright suites shall pass before changes are merged.