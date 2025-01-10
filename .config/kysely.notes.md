### References

- https://github.com/kysely-org/kysely-ctl?tab=readme-ov-file
- https://knexjs.org/guide/migrations.html#migration-cli

### For first time set up of Kysely

- run the command: npm run kysely:init

### To create a new migration file

- run the command: npm run kysely:create-migration --migration_name=<migration-name>

### To run all unrun migrations

- run the command: npm run kysely:migrate

### To run the next migration that has not yet been run

- run the command: npm run kysely:up

### To undo the last migration that was run

- run the command: npm run kysely:down

### To automatically generate the types for the DB schema

- run the command: npm run kysely:generate-types
