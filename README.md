# docker-crew
This project is being developed by Sweep 25 of the Spring 2021 CSE120 course.
Team members: Malia Bowman, Gustavo Canela, Wyssanie Chomsin, Jakob Potosme, Spencer Tang
# Version 2
## Sub Team Members
- **API Team:** Jakob, Malia, Spencer
- **Database Team:** Jakob, Mannie, Gustavo
- **UI Team:** Malia
- **Modbus/Bacnet Team:** Mannie
## Use Cases
- [ ] User can create a directory on the Sweep API from the webapp interface
    - [ ] **[UITeam]** Add *Create Directory* button to Directories UI page
    - [ ] **[APITeam]** Create post request function to *Create Directory* endpoint
    
- [ ] User can create a stream in a directory on the Sweep API from the webapp interface
    - [ ] **[UITeam]** Add *Create Stream* button to Streams UI page
    - [ ] **[UITeam]** Create a *Add Stream* UI page/Form
    - [ ] **[APITeam]** Create post request function to *Create Directory* endpoint

- [ ] User can add a device to an existing stream on the Sweep API from the webapp interface 
    - [ ] **[UITeam]** Create new device page in UI
    - [ ] **[APITeam]** Create post stream request function to sweep apu

- [ ] User can remove a stream from the Sweep API using the webapp interface
    - [ ] **[UITeam]** Add check boxes to streams UI to specify streams to be removed
    - [ ] **[APITeam]** Create delete stream request function to 

STRETCH GOALS: Further things to complete if we have time
- [ ] Edit ui

# Version 1
## Sub Team Members
- **API Team:** Jakob, Malia, Spencer
- **Docker Team:** Mannie
- **Database Team:** Jakob, Gustavo
- **UI Team:** Malia
## Use Cases
Here we layout the required use cases for our first implementation, as well as the tasks required to implement them.
- [x] User can launch a Node.js application in a docker container
    - [X] Create simple Node.js Webapp using Express.js
    - [X] Create package.json file with required dependencies
    - [X] **[DockerTeam]** Create Dockerfiles for containerising Node.js Webapp

- [X] User can view their directories on their Sweep API account given an authentication key and token
    - [X] **[APITeam]** Add Axios dependencies to package.json 
    - [X] **[APITeam]** Create test directory data
    - [X] **[UITeam]** Create directories page UI
    - [ ] **[DBTeam]** Create Directories table in Database
    - [ ] **[DBTeam]** Save directories to local Database
    
- [ ] User can view existing streams on their Sweep API account
    - [X] **[APITeam]** Create test data on streams
    - [ ] **[UITeam]** Create UI for streams page
    - [ ] **[APITeam]** Create get request function to Sweep API/streams endpoint

STRETCH GOALS: Further things to complete if we have time
- [ ] User can create account with Sweep API using interface
    - [ ] **[UITeam]** Login or Create New Sweep API account UI
    - [ ] **[APITeam]** Create post request function to *Create API Key* endpoint
    - [ ] **[APITeam]** Create get request to *Get User Login Token* endpoint
    - [ ] **[APITeam]** Save Sweep API account auth to .env file
    - [ ] **[DBTeam]** Save Sweep API auth info to local DB

## Wireframes
![](https://i.imgur.com/D9XLy0X.png)
