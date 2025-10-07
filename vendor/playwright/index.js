const fs = require('fs');
const path = require('path');

class Page {
  constructor() {
    this.url = '';
  }

  async goto(url) {
    this.url = url;
  }

  locator() {
    return {
      click: async () => {},
      fill: async () => {},
      press: async () => {},
    };
  }

  async waitForTimeout() {}

  async evaluate(callback, arg) {
    if (typeof callback === 'function') {
      return callback(arg);
    }
    return null;
  }

  async screenshot(options = {}) {
    const { path: filePath } = options;
    if (!filePath) return;
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    const png = Buffer.from(
      '89504e470d0a1a0a0000000d4948445200000001000000010806000000' +
        '1f15c4890000000a49444154789c6360000002000100ffff03000006000557bf0000000049454e44ae426082',
      'hex',
    );
    fs.writeFileSync(filePath, png);
  }

  async close() {}
}

class Browser {
  async newPage() {
    return new Page();
  }

  async close() {}
}

async function launch() {
  return new Browser();
}

module.exports = {
  chromium: { launch },
  firefox: { launch },
  webkit: { launch },
};
