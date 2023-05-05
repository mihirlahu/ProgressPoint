Title :  ProgressPoint: Real-Time-Communication-Platform


Description: Progress Point is a centralized platform for teams to communicate and collaborate on software development projects in real time. 
The platform will enable software engineers to be a part of multiple team rooms, post updates about their tasks, and collaborate on problem-solving
in real-time. The platform will enable developers to react and comment on each others’ posts and communicate. With Progress Point, we aim to improve teamwork and productivity in software
development projects. This platform will help software engineers stay aligned, work together to solve problems efficiently and deliver high-quality software products on time.

=======================================================================================================

Project group

1) Bapat Parth, bapatparth@vt.edu, bapatanuparth
2) Palyekar Mihir Lahu, mihirlahu@vt.edu, mihirlahu
3) Joshi Vivek, vivekj@vt.edu, Vivek-Joshi-99
4) Deegoju Sushma, sushmad@vt.edu, Sushmadeegoju

=======================================================================================================


HOW TO RUN THE CODE:

Make sure you have NODE.JS and NPM installed along with BREW.
https://brew.sh/#install
Make sure you have MongoDB installed, and it's up and running.
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

RUN: SUDO NPM INSTALL (RUN THIS COMMAND AS ADMIN)

TO START THE CODE: NPM RUN DEV


=======================================================================================================


HOW TO TEST THE CODE:

Please refer to the testing file attached for more information: 

Link: https://github.com/mihirlahu/ProgressPoint---Real-Time-Communication-Platform/blob/main/How%20to%20run%20tests.pdf

=======================================================================================================

Use Case: Creating a New Team Room

Precondition: The manager is logged in to the Progress Point application.

Main Flow:

The manager fills chat room name and description in the "Create New Chat Room!" section on his dashboard
The manager clicks on the "Create" button.
The application creates a new team with the specified name and description.

Alternative Flow:
If the chat room name is already used, a new chat room will not be created.

Postcondition:
The software engineer has successfully created a new team room, this team room is visible on the search page and can now collaborate with the team members using the Progress Point application.

How to run the use case:
1) Create a manager account using the signup procedure.
2) Create a chat room by using the main flow of the use case.

Expected Behaviour:
1) User is alerted about the newly created chat room.
2) Developers and other managers can search the classroom.

=======================================================================================================
