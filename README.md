# Deliverable 2: Data Definition Queries
You must include a DDL.SQL file. It should be import-able on the database server that is used to host your CS340 database. If the .SQL file cannot be imported or does not create tables as your Schema describes, then you will lose valuable feedback from your reviewers. In later steps, you will lose points if your DDL.SQL file is not import-able or is not consistent with your design.

## DDL.SQL Requirements:
- The SQL should exactly match the schema of the report
- All the example data shown in your report needs to be included in your .SQL file (insert the data into the respective table using INSERT statements)
- Each table should have the correct primary key
- Foreign keys should be correctly defined
- Where appropriate, you should use CASCADE (as described in [Exploration - MySQL Cascade](https://canvas.oregonstate.edu/courses/1914742/pages/exploration-mysql-cascade)) to handle changes in primary key values

## Tips:
- You are welcome to disable commits and foreign key checks at the beginning of your file (see [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/optimizing-innodb-bulk-data-loading.html)). However, you should turn them back on at the end to minimize import errors.
  - For example:
```sql
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

... [your SQL goes here]
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
```
- It is recommended that you use `DROP TABLE IF EXISTS` prior to any create table statements or else use the `CREATE OR REPLACE TABLE` statement as described in [Activity 1](https://canvas.oregonstate.edu/courses/1914742/pages/activity-1-creating-a-customer-object-table) to minimize import errors. 

**Example DDL File**: see [bsg_db.sql](https://canvas.oregonstate.edu/courses/1914742/files/98097705/download?download_frd=1) Download bsg_db.sql which was generated using the mysqldump tool as described in [Activity 2 - Backing up and Restoring your Database](https://canvas.oregonstate.edu/courses/1914742/pages/activity-2-backing-up-and-restoring-your-database)
