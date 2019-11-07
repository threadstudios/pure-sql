-- name: createTable
CREATE TABLE IF NOT EXISTS test__table
(
`id` INT AUTO_INCREMENT PRIMARY KEY,
`key` VARCHAR(255) NOT NULL
)

-- name: dropTable
DROP TABLE test__table