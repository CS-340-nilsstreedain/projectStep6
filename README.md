# Project Step 5 Draft (Implement MOST Remaining CRUD functionalities)
## Objective
In this step, you implement the CREATE, READ, UPDATE and DELETE functionalities for ONE entity (table) in your web app as described in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide). This step does not introduce any new project parts. Instead, this step is meant to keep our projects on track to submitting the final product next week. You should implement, at minimum, two-thirds of your CRUD functionalities. However, you are free to implement more. Finishing all CRUD functionalities in this for this step means more time for your group to prepare and polish your final submission.

## The Draft Phase
Please see [Draft Phase](https://canvas.oregonstate.edu/courses/1914742/pages/draft-phase?wrap=1) for more information about this phase of the Project Step, including how to submit drafts.

## Deliverable(s)
(**NOTE**: in addition to the ZIP archive, you must include additional details in your discussion post. See below.)

You should submit a **ZIP** archive containing **5 THINGS**:
1. A **PDF** file containing information from previous steps. This file should be updated to reflect any changes made to the project. Furthermore, it should be consistent in its details of the overall design.
2. An **SQL file containing your Data Definition Queries** (DDL.sql) and your **sample data INSERT statements**
3. An **SQL file containing your Data Manipulation Queries** (DML.sql). These are the queries that your website uses to perform the user-requested CRUD operations. Thus SELECT, INSERT, UPDATE and DELETE queries to provide the functionalities described in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide).
4. A **URL** to an index.html listing all your HTML pages. Put this URL on the top of your PDF file as well as on your discussion post.
5. The current versions of your front-end and back-end code.

The zip file should be named `projectgroupX_stepX_DRAFT/FINAL.zip` (e.g., `ProjectGroup42_Step4_DRAFT.zip` or `ProjectGroup42_Step4_FINAL.zip`).

Your .ZIP file should be posted to the Ed Discussion (please follow the instructions under "How do I turn in this assignment" below). Both members' names and your Group number should be included in the files as well as a comment on the post.

**Ensure consistency**: as your project changes, be sure to update each of your deliverables as necessary to ensure an overall consistency in your design. If your design is not clear because it is inconsistent, then you may lose points.

Along with the deliverables listed above, you must also include the following details in your discussion post:
1. What functionality works,
2. What functionality doesn’t work,
3. Where/why you are blocked on certain functionality.

This information is meant to help reviewers understand any difficulties you may be having with your project, giving them an opportunity to provide advice on how you might resolve any issues you have encountered. Thus, being detailed will help you receive better advice on how to overcome any issues. If all your functionality works, then feel free to say so in your post and omit #2 and #3 above. Also feel free to ask open-ended advice on existing/planned functionality.

### Deliverable 1: PDF File
#### Fixes based on Feedback from Previous Steps:
Itemize the issues raised by your peers and the TAs/instructors in Step 1. This means including a description of each issue as well as how you fixed it. If you chose not to address an issue raised by a peer or the TA/Instructor, you must indicate why you think the design should not change. In other words, you must reason why the perceived issue isn't really an issue. If you make any additional changes based on your own design decisions (including issues that you found and fixed on your own), they should also be listed here.

If you haven't received any feedback, then state this here and do not include the preceding details.

#### Project Outline and Database Outline, ERD, Schema, & Sample Data - Updated Versions:
This section should contain the updated outline, ERD, Schema and sample data based on the feedback from the grader and your peers as well as any design decisions that you decided to make on your own. It's required that you apply the various design tools you learned until now (like Normalization steps, ON DELETE CASCADE, etc.) to review and fix your ERD and Schema. Your Final Project submission will be graded based on your application of these concepts.

### Deliverable 2: Data Definition Queries (DDL.sql) - Updated Version
Your DDL.sql file should be updated to reflect any changes in your design since your last submission.

### Deliverable 3: Data Manipulation Queries (DML.sql) - Updated Version
Your DML.sql file should be updated to reflect any changes in your design since your last submission.

### Deliverable 4: URL to your index.html page - Updated to Work with NEW CRUD Functionalities
You should submit a URL of an index page containing links to those pages which implement the CRUD step in your website.

We expect most of your functionality to work at this step. Review the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide) if you are unsure what these should.

### Deliverable 5: Front-End and Back-End Code - Updated Versions
Include the front-end (HTML, etc,.) and back-end (server-side) code for your project. Do not include folders of common libraries as this will make the zip file very large. Your code should be organized in a sensible way. Furthermore, the naming-convention of files/folders should make the organization self-documenting. Your code should also use meaningful variable names and include brief comments to explain logic. Any code that is not original should have a citation to clearly credit the source.

## Frequently Asked Questions:
### This is too much work! I can't complete it in so much short time!
Well, actually you don't need to implement all the pages with all the functionalities! You just need to get started. Since this is Step has only a Draft and Review, you get points for simply turning in things as they are. If you get stuck and can't implement anything, you can still turn it in on the Review Group and get points for submission and discussion. You have until Final Week to get the web application working.

### My website isn't finished, what should I do?
This assignment is to ensure that you get timely feedback (and also give others) about how your programming approach is coming along. Your project need not be completely functioning for this Step's submission since it won't be graded based on that.

### How exactly is this different from the Step where I created those HTML pages?
In this Step, you will be actually writing backend code to display data from the database. So the sample data that you provided in the previous Steps should be displayed when a user visits those pages.

### What platform can I use to interact with the database?
You can write your backend code in anything as long as you write all the SQL queries yourself and don't depend on a library like an ORM to generate them for you. Basically, you will just need to put all your Data Manipulation Queries in your backend code to send to the database and then process their result to be displayed on the web page.

### How do I connect to the database !? I haven't used NodeJS/Flask before!
Well, actually you did connect to a database in Week 1 using NodeJS or Flask. Also, you may use the sample code provided in the project starter apps to build upon. Looking at that code should help answer most of your questions. But if you are still stuck, please ask in Ed Discussions or teams.

### How many web pages should my project have?
There is neither a minimum or maximum number of HTML pages that your project should have but it is desirable that your project is spread across different pages rather than a single one. You may combine or separate functionalities from the CS340 Project Guide across pages as you deem necessary.

### Should this field in my form be a textbox/textarea/drop-down/some new UX style fancy element ?
This is your choice and an user needs to easily understand how to use it (maybe if it's too difficult you could provide tooltips about how to use it). Your reviewers/graders might disagree and you should be able to justify the usage of one over the other.

### I want to implement functionalities like shopping cart/login/authorization/authentication in my Project?
You really shouldn't need to implement authentication or a shopping cart, since this is primarily about giving admin CRUD access to your entities instead of a customer facing shopping experience. So prioritize implementing all of the functionalities described in CS340 Project Guide first and then later you may add any extra functionalities if you want. In case you are implementing some kind of authentication mechanism, be sure to provide the peer reviewers and graders a way to authenticate without having to sign-up (like a default username and password which you would include in your submission somewhere)
