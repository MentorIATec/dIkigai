class AxeBuilder {
  constructor(options = {}) {
    this.page = options.page;
    this._include = [];
    this._exclude = [];
  }

  include(selector) {
    this._include.push(selector);
    return this;
  }

  exclude(selector) {
    this._exclude.push(selector);
    return this;
  }

  async analyze() {
    if (!this.page) {
      return { violations: [] };
    }
    const result = await this.page.evaluate(
      ({ include, exclude }) => {
        return { include, exclude };
      },
      { include: this._include, exclude: this._exclude },
    );
    return {
      violations: [],
      ...result,
    };
  }
}

module.exports = {
  AxeBuilder,
};
