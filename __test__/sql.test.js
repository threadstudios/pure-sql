process.env.SQL_CONNECTION_STRING = "mysql://root:cassette@127.0.0.1/pure";
const { sql, q } = require("../index");

describe("Loading queries", () => {
  it("should load the queries inside the projects sql directory", () => {
    expect(q.queryStore.test).toBeDefined();
  });
});

describe("Querying", () => {
  it("should execute a simple query to create a table", async done => {
    try {
      const result = await sql.execute(q.test.createTable);
      expect(result.ok).toBe(true);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("should allow for passed in sql queries at run time", () => {
    q.addQueries("testCrud", require.resolve(`../__fixtures__/testcrud.sql`));
  });

  it("should execute a query with parameters and return the inserted ID", async done => {
    try {
      const result = await sql.execute(q.testCrud.create, {
        key: "sqlTest"
      });
      expect(result.ok).toBe(true);
      expect(result.insertId).toBe(1);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("should be able to return a single record through a query", async done => {
    try {
      const result = await sql.getFirst(q.testCrud.getByKey, {
        key: "sqlTest"
      });
      expect(result.id).toBe(1);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("should be able to return multiple records through a query", async done => {
    try {
      await sql.execute(q.testCrud.create, { key: "sqlTest2" });
      const result = await sql.get(q.testCrud.getAll);
      expect(result.length).toBe(2);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("should throw if the query does not exist", async done => {
    try {
      await sql.execute(q.test.deleteAllTheThings);
      done();
    } catch (e) {
      expect(e).toBeDefined();
      done();
    }
  });
});

afterAll(async () => {
  await sql.execute(q.test.dropTable);
  sql.connection.end();
});
