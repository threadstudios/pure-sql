/* eslint-disable no-underscore-dangle */
const fs = require("fs-extra");
const puresql = require("puresql");

class Queries {
  constructor() {
    this.queryStore = {};
    this.__loadQueries();
    this.__q = this.__buildTree();
  }

  __buildTree() {
    return Object.keys(this.queryStore).reduce((acc, key) => {
      acc[key] = Object.keys(this.queryStore[key]).reduce((sacc, qKey) => {
        if (qKey !== "__file") {
          // eslint-disable-next-line no-param-reassign
          sacc[qKey] = this.queryStore[key][qKey];
        }
        return sacc;
      }, {});
      return acc;
    }, {});
  }

  __loadQueries(path = `${process.cwd()}/sql`) {
    try {
      const files = fs.readdirSync(path);
      files.forEach(file => {
        this.queryStore[file.replace(".sql", "")] = puresql.loadQueries(
          `${path}/${file}`
        );
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  addQueries(key, file) {
    this.queryStore[key] = puresql.loadQueries(file);
    this.__q = this.__buildTree();
  }
}

module.exports = new Proxy(new Queries(), {
  get(target, props) {
    if (target[props]) {
      return target[props];
    }
    return new Proxy(target.__q, {
      get(subTarget, subProps) {
        return target.__q[props][subProps];
      }
    });
  }
});
