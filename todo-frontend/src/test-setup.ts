import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
});

// Suppress console.error logs during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});
