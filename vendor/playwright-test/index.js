const path = require('path');
const { chromium, firefox, webkit } = require('playwright');

function noop() {}

function expect(value) {
  return {
    toEqual(expected) {
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        throw new Error(`Expectation failed: ${JSON.stringify(value)} !== ${JSON.stringify(expected)}`);
      }
    },
    toBe(expected) {
      if (value !== expected) {
        throw new Error(`Expectation failed: ${value} !== ${expected}`);
      }
    },
    toBeTruthy() {
      if (!value) {
        throw new Error(`Expectation failed: value is not truthy`);
      }
    },
  };
}

function createTestFunction() {
  const testFn = async function test(name, callback) {
    console.warn(`Playwright test stub executed for ${name}.`);
    if (callback) {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      try {
        await callback({ page }, {
          outputPath(fileName) {
            return path.join(process.cwd(), 'test-output', fileName);
          },
          attach: noop,
        });
      } finally {
        await browser.close();
      }
    }
  };
  testFn.describe = noop;
  testFn.skip = noop;
  testFn.only = noop;
  return testFn;
}

function defineConfig(config) {
  return config;
}

const devices = {};

module.exports = {
  expect,
  test: createTestFunction(),
  chromium,
  firefox,
  webkit,
  defineConfig,
  devices,
};
