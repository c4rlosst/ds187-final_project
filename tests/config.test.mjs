import assert from "node:assert/strict";
import test from "node:test";
import { mysqlConfig } from "../scripts/mysql-config.mjs";

const valid = {
  MYSQL_HOST: "127.0.0.1", MYSQL_DATABASE: "test", MYSQL_USER: "app",
  MYSQL_PASSWORD: "private-value", MYSQL_TLS: "false", NODE_ENV: "test",
};

test("configuration failures identify fields without printing secrets", () => {
  assert.throws(() => mysqlConfig({ ...valid, MYSQL_PORT: "private-value" }), (error) => {
    assert.match(error.message, /MYSQL_PORT/);
    assert.doesNotMatch(error.message, /private-value/);
    return true;
  });
});

test("production requires certificate-verified TLS and disables multiple statements", () => {
  assert.throws(() => mysqlConfig({ ...valid, NODE_ENV: "production" }), /TLS/);
  const config = mysqlConfig({ ...valid, MYSQL_TLS: "true", NODE_ENV: "production" });
  assert.equal(config.ssl.rejectUnauthorized, true);
  assert.equal(config.multipleStatements, false);
});
