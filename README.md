# Project Step 6 (Portfolio Assignment)
## Objective
This is the Final step of your project. At this point, you will submit all of the documentation and code for your full project. Your submission represents the final version of your application: there is no peer or group review for this Step. 

This assignment is designated as a program "portfolio assignment." You are encouraged to publicize it as part of your portfolio. Remember your school-hosted database will be deleted at the end of the term, so you may want to consider other options for showcasing your work. For example, you might record a video walkthrough of your website, put your final project PDF on LinkedIn, or host the site (MySQL database, HTML pages and code) on a third party hosting platform.

For question about browser compatibility, see the FAQ section.

## Deliverable(s)
You should submit a **ZIP** archive containing **5 THINGS** (note the additional requirements for the PDF document):
1. Your final **PDF** including (in the same order as is listed here),
    1. A one page (max) summary of feedback and changes made to this Project from the initial version until now.
    2. Updated  (as appropriate) versions of your...
      1. Project Outline
      2. Database Outline
      3. ERD
      4. Schema
      5. Sample Data.
    3. A section containing screen captures of each of the UI pages on your website. There should be a title immediately above each Screen capture which explains the CRUD step (e.g., "READ/BROWSE/DISPLAY Customers page" or "CREATE/INSERT/ADD NEW Invoice page").
2. An **SQL file containing your Data Definition Queries** (DDL.sql) and your **sample data INSERT statements**
3. An **SQL file containing your Data Manipulation Queries** (DML.sql).
4. The **URL** of **your hosted, functioning project website** on the first page of the PDF as well as a comment on your submission. You will need to prefix the URL with http:// or https:// . If you want your web app to be tested only on a specific browser, you must let the graders know by indicating so on the first page of the PDF in a noticeable fashion.
5. **All the source code for your Project**: This includes files containing CSS, HTML, JS and the code for server-side platform that you decided to use. Code should include citations that clearly credit non-original work. For any external libraries, you may include the package.json (or the equivalent) instead of including all the files for the library. Please remove your username and password from the dbcon (or equivalent) file. **Points will be deducted from your grade if you do not include the source code.**

**Ensure consistency**: be sure to update each of your deliverables as necessary to ensure an overall consistency with your final design. If your design is not clear because it is inconsistent, then you may lose points.

The project website should be up and running until the last day of term.

If you are still facing any issues, don't hesitate to ask for help.

### When asking a question always include:
1. What's the unexpected behavior/error message that you face
2. What you are trying to achieve
3. A link to your code (using a website like pastebin.com). Make sure others can see all the related code files.
4. What you have already tried. This ensures that others don't try solutions that you have already found to not work.

## Points:
This assignment is worth 600 points of your Project Grade.

You will be graded based on:

### Executive Summary:
- 1 page (max) summary of feedback and changes made to this Project from the initial version until now.
- Note that the summary is different from the previous steps which asked you to copy/paste feedback.
- The executive summary has facts about the database design process and implementation steps. It is a reflection on the major changes to this project from your initial proposal to now (your final submission) as well as what feedback influenced those changes.
- The executive summary should be included at the beginning of your PDF.

### Project and Database Outlines:
- The updated versions of the Project and Database outline. Reading these should give a layman the complete idea of your Project and its "minworld," making the navigation of your website intuitive.

### ER Diagram:
- The updated version of your ERD following the notations we use in the class.

### Schema:
- The updated version of the schema that should reflect the database outline exactly. It will be graded on the extent to which it matches the outline with an emphasis on if relationships and keys are correct. Again, please stick to the notations that we use in the class.

### UI Screen Shots with Informative Titles
- Screen captures of each of the UI pages on your website. Add a title immediately above each Screen capture that explains the CRUD step (e.g. "READ/BROWSE/DISPLAY Customers page" or "CREATE/INSERT/ADD NEW Invoice page").

### Data Definition Queries (DDL.sql):
- The updated version of the SQL file should be cleanly import-able on the database Server that is used to host your CS340 database. If the .sql file cannot be imported or does not create tables as your Schema describes you will lose all of these points.

### Data Manipulation Queries (DML.sql):
- The updated version of the SQL file which provides all your DML queries in the format described in Project Step 3. You will lose points if you don't have queries providing the functionalities listed in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide).

### Website Functionality:
- All the functionalities described in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide) should be implemented.
- You should not expect the user to manually enter foreign keys. Instead, you should abstract foreign keys away from the interface by providing drop-down menus or some other UI element, allowing users to establish relationships between objects based on identifying features of those objects rather than on arbitrary numbers (i.e., IDs). For example, in the BSG database, when adding a row to the relation between bsg_people and bsg_cert, we would expect the bsg_cert.title values to be shown in a dropdown (or perhaps as a set of radio buttons) rather than a drop down populated with bsg_cert.id. And we certainly would not expect the user to know and enter the correct bsg_cert.id by hand into a text box.
- The URL of the website should be included in the PDF as well as in a comment on the submission.
- READ/BROWSE/DISPLAY pages (SELECT for every table)
- CREATE/INSERT/ADD NEW pages (INSERT for every table)
- DELETE functionality (for at least one M:N, i.e., a composite entity, causing no anomalies)
- EDIT/UPDATE functionality (for at least one M:N, i.e., a composite entity)
- DYNAMIC DISPLAY/SEARCH functionality (for at least one table)

### Style:
- Your website should be reasonably easy to navigate. We are not expecting any fancy CSS, but tabular data should be displayed in tables and form elements should be reasonably grouped. Section headers for parts of your pages/forms would definitely make your site easier to navigate. Furthermore, the CRUD operations should be somewhat obvious to complete.
- Your write-up in the PDF should be well formatted and divided into sections for easy navigation and readability.
- Your SQL files should have brief comments mentioning what functionality/entity/relationship the query is related to.

**Points will be deducted if you do not include the source code.**

## Frequently Asked Questions:
### Does my project actually satisfy all the criteria ?/What does X spec from the Project Spec mean?
Ask in office hours/Ed Discussions, describing the relevant details of your Project so that we can help you. Implementations are hard to describe in generic manner and it always helps to talk in terms of your project.

### Should my Project be compatible with all/X/Y/Z browser ? What browser should it be able to run to?
If you want your web app to be tested only on a specific browser, let the graders know by indicating on: a) the first page of the PDF in a noticeable fashion AND b) on every page of your website. Without such a note, the graders will test it using the browser they prefer and would expect it to work.
