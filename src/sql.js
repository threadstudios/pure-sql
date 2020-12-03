/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mysql = require("mysql");
const puresql = require("puresql");
const response = require("./response");

class ThreadSQL {
  constructor() {
    const sqlParams = process.env.SQL_CONNECTION_STRING
      ? process.env.SQL_CONNECTION_STRING
      : {
          host: process.env.SQL_HOST,
          port: process.env.SQL_PORT || 3306,
          user: process.env.SQL_USER,
          password: process.env.SQL_PASSWORD,
          database: process.env.SQL_DATABASE
        };
    this.connection = process.env.SQL_USE_POOL ? mysql.createPool(sqlParams) : mysql.createConnection(sqlParams);
    this.adapter = puresql.adapters.mysql(this.connection);
  }

  async __get(query, params) {
    return query(params, this.adapter);
  }

  async execute(query, params = {}) {
    const result = await query(params, this.adapter);
    return response.execute(result);
  }

  async get(query, params = {}) {
    const result = await this.__get(query, params);
    return response.get(result);
  }

  async getFirst(query, params) {
    const result = await this.__get(query, params);
    return response.getFirst(result);
  }

  // eslint-disable-next-line class-methods-use-this
  async combine(first, secondary) {
    const result = await first;
    const finalResult = await secondary(result);
    return finalResult;
  }
}

module.exports = new ThreadSQL();
