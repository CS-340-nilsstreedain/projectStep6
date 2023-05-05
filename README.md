# Project Step 2 (Normalized Schema, DDL, Sample Data, & Revisions to Existing Deliverables)
## Objective
In this step, you will apply the normalization process to your current design, detail your schema, and develop the SQL to both define your tables AND insert your sample data.

After you apply feedback and normalize your database, make sure that each piece of documentation is consistent with one and other: there should be no conflicts in design. The overall design should be clear to the reader.

## Deliverable(s)
You should submit a **ZIP** archive containing **2 THINGS**:
1. A **PDF** file containing all the items from Step 1, plus a schema diagram which should follow the (updated) database outline and ER diagram, and the example data used in your database.
2. An **SQL file containing your Data Definition Queries** (DDL.sql) and your **sample data INSERT statements**

Your .ZIP file should be posted to the Ed Discussion (please follow the instructions under "How do I turn in this assignment" below)

Both members' names and your Group number should be included in the files as well as a comment on the post.

It is expected that you apply all the concepts you have learned until now.

The zip file should be named **projectgroupX_stepX_DRAFT/FINAL.zip** (e.g., *ProjectGroup42_Step2_DRAFT.zip* or *ProjectGroup42_Step2_FINAL.zip*).

### Deliverable 1: PDF File
#### Fixes based on Feedback from Step 1:
Itemize the issues raised by your peers and the TAs/instructors in Step 1. This means including a description of each issue as well as how you fixed it. If you chose not to address an issue raised by a peer or the TA/Instructor, you must indicate why you think the design should not change. In other words, you must reason why the perceived issue isn't really an issue. If you make any additional changes based on your own design decisions (including issues that you found and fixed on your own), they should also be listed here.

If you haven't received any feedback, then state this here and do not include the preceding details.

#### Project Outline and Database Outline - Updated Version:
Provide the updated version of your submission for Project Step 1. It should be consistent with any changes listed in section a.

#### Entity-Relationship Diagram - Updated Version:
Provide the updated ERD. It should be consistent with any changes in sections a and b.

Remember: you do not need to include all attributes in the ERD. However, you should include the primary key. Other attributes will be detailed in the schema.

#### Schema:
Apply normalization to your design as described in [Exploration - Normalization Steps](https://canvas.oregonstate.edu/courses/1914742/pages/exploration-normalization-steps). Start by creating a sample report (perhaps in Excel or Google Sheets) with some data and look for redundancies and anomalies. Once your design meets 2NF, look for any remaining transitive dependencies and decide whether you will further normalize to 3NF. Note that we do not need to remove all transitive dependencies, but we should remove transitive dependencies that will likely lead to data integrity issues. ***Once your schema is normalized, update your overview, outline, and ERD for consistency.***

Your Final Version (and the Final Versions of all future steps) will be graded based on the overall consistency of your design. This means that all pieces--from the Project Outline to your final implementation--should be consistent. You may use an automated schema generator such as the diagram visualizer in PhPMyAdmin, MySQL Workbench, or draw the schema by hand and upload a scanned legible copy. You should follow the notation covered in class. Diagrams should be legible: they should be large enough to read and clean enough to properly interpret. If a diagram is ambiguous because it is not readable, then you may lose points in your Final Draft.

#### Example Data:
All the example from each table in your schema should be pasted into your report. Clearly indicate which rows go with which table.

Approximately 3-5 rows of data per table are enough data to demonstrate how the table works (e.g., foreign keys demonstrate 1:M relationships and intersection tables show M:M relationships in action). You are free to use made-up data, but it should be polite values that reasonably represent the database in action. You can also get data from other sources, such as a sample reports from some website, but please anonymize the data so that personal identifiers are not disclosed.

### Deliverable 2: Data Definition Queries
You must include a DDL.SQL file. It should be import-able on the database server that is used to host your CS340 database. If the .SQL file cannot be imported or does not create tables as your Schema describes, then you will lose valuable feedback from your reviewers. In later steps, you will lose points if your DDL.SQL file is not import-able or is not consistent with your design.

#### DDL.SQL Requirements:
- The SQL should exactly match the schema of the report
- All the example data shown in your report needs to be included in your .SQL file (insert the data into the respective table using INSERT statements)
- Each table should have the correct primary key
- Foreign keys should be correctly defined
- Where appropriate, you should use CASCADE (as described in [Exploration - MySQL Cascade](https://canvas.oregonstate.edu/courses/1914742/pages/exploration-mysql-cascade)) to handle changes in primary key values

#### Tips:
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

## Frequently Asked Questions
### This is too much work! I can't design the entire database and sample data in such a short amount of time!
You don't need to implement the entire thing! You just need to get started. For Drafts, you get points for turning in things as they are. If you get stuck and can't implement it all, you can still turn in something for Review and get points for submission and discussion.

### How should I create my Schema diagram?
Refer to the video in [Activity 1 - Access and Use the CS340 Database](https://canvas.oregonstate.edu/courses/1914742/assignments/%24CANVAS_OBJECT_REFERENCE%24/assignments/g5e8e55d71fba7ef7cc757bfcedfc8520) for how to use PhPMyAdmin. You can also use MySQL Workbench as described in [Exploration - Creating ER Diagram MySQL Workbench](https://canvas.oregonstate.edu/courses/1914742/pages/exploration-creating-er-diagram-mysql-workbench). There are other diagraming tools available (e.g. Visio) and a picture/scan of a neatly hand drawn diagram is also acceptable.

### How do I create my DDL script?
You can use MySQL Workbench to forward engineer a schema and then import it into the CS340 Class Database hosted on the flip servers as described in [Exploration - Creating ER Diagram MySQL Workbench](https://canvas.oregonstate.edu/courses/1914742/pages/exploration-creating-er-diagram-mysql-workbench). After you import it, you can use the Export tool in PhPMyadmin. You can also create the SQL by hand as was done in [Activity 1](https://canvas.oregonstate.edu/courses/1914742/pages/activity-1-creating-a-customer-object-table).

### Can I use sample data from another source (e.g. from XYZ website)?
Yes, as long as you a) honor academic integrity by citing your source and b) limit the amount of data included. This is supposed to be sample data (only 3-5 rows are required) so you shouldn't include more than 10 rows or so. Also keep in mind that you will have to paste all the data into your PDF and too much data will make your document difficult to read.

Also note that, even though you can save time by importing one table's data, you will still need to manually create rows for other tables. For instance, assume a grocery store database had the following entities:
- PRODUCTS (**PROD_NUM**, DESCRIPTION, QTY, UNIT_OF_MEASURE, PRICE)
- AISLES (**AISLE_NUM**, DESCRIPTION)
- PRODUCT_AISLES (**PROD_NUM**, **AISLE_NUM**)

You could easily find rows of sample data from a grocery store to insert into the PRODUCTS tables. However, you should still expect to create the sample data for the AISLES and PRODUCT_AISLES tables manually because it is unlikely you will find sample data that exactly matches your schema design.
