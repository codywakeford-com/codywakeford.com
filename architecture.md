

User <--> View <--> Controller <--> Services <--> Database/API  


### View
Handles user input and reacts to state changes

- Components, Pages, Layouts
- Pinia Store for state localisation

### Controller 
Takes user input and decides what needs to be done.
It then completes these tasks using the service layer.
Completely in charge of execution flow.
When the task is complet it updates the app state.

- Controller Classes

### Services
This layer can interact with the database and manipulate data.
This is a fleet of services that the controller can pick from.
Each service should be self contained and stateless.

- Service Classes


### Flow

1. User Makes an Input
2. The input is sent to the controlle
3. The controller calls stateless services to complete the required task.
4. The controller updates the state as required in the pinia store.
5. The view reacts to the state change.

