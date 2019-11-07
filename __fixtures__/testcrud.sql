-- name: create
INSERT INTO test__table
(`key`)
VALUES (:key)

-- name: getByKey
SELECT * FROM test__table
WHERE `key` = :key

-- name: getAll
SELECT * FROM test__table