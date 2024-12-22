
# Fireflies.ai Backend Test Solution

This is the backend solution for the Fireflies.ai interview test, designed to run with Docker.

## Setup

### Prerequisites

To run this application, you will need to have Docker and Docker Compose installed on your machine.

- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

### Running the Application

1. Build and start the application and MongoDB:

```bash
docker compose up --build -d
```

2. The application will be accessible at **localhost, on port 3000**.

### Running Tests

To run the tests, execute:

```bash
docker exec -it nest-app-container npm t
```

## API Documentation

The API documentation is available at `/api/docs`. You can **explore and test the endpoints using Swagger**.

## Q&A

**Question:** It seems there is a very critical bug here. Can you spot it?  
**Answer:** Users were able to access all meetings. This was fixed by validating and filtering meetings based on the authenticated user. Additionally, update permissions are now restricted: each user can only update their own meetings.

**Question:** It doesn't look very performant as the meeting count increases. Would it scale?  
**Answer:** No, it wouldn't scale well. Here are some steps to improve scalability:  
- Enforce `notablescan` in MongoDB to ensure all queries use indexes.  
- Add filters and pagination to endpoints/queries that fetch meetings or tasks in batches.  
- Utilize a data lake to generate stats and dashboards more efficiently.  

## Explaining Decisions

- **Used [NestJS](https://nestjs.com/):** Chose NestJS for its extensive documentation, ease of use, and good architecture.
- **Created Meeting and Task Modules:** Organized the code by separating it into domains (Meeting and Task), making the application better organized and easier to scale.
- **Containerization:** Used Docker to containerize MongoDB and the application itself for easy setup and configuration.
- **Added [@nestjs/mongoose](https://www.npmjs.com/package/@nestjs/mongoose):** Integrated Mongoose for MongoDB data modeling and validation in the NestJS framework.
- **Authentication Middleware:** Applied authentication middleware across all layers to ensure security at every level.
- **Unit Test:** Created unit tests for every line of every controller and service in the application.
- **Input Validation:** Used class-validator to ensure proper input/payload validation for API requests.
- **Added Duration Field in Meeting:** Added a duration field in the meeting model to better support the dashboard functionality (could be done with an endDate field as well).
- **Mapped Application Errors:** Created a MeetingError class to provide a better error handling system with an error enum for clients.
- **Granular Services:** Split services into smaller, more manageable classes with single responsibilities for better readability and maintenance.
- **Try/Catch in Controllers:** Wrapped controller code in try/catch blocks to handle exceptions thrown from deeper layers.
- **Fixed Security Breach:** Added validation to prevent users from accessing or modifying data from other users.
- **Changed PUT to PATCH:** Updated the /api/meetings/:id/transcript endpoint to PATCH, as it only updates part of the resource.
- **Barrel Imports:** Implemented barrel imports to simplify module imports and improve code organization.
- **Absolute Paths:** Configured absolute paths to simplify imports and easier handling of files.
- **Mock AI Implementation:** Created a mock implementation for AI, with comments indicating where AI would be used.
- **Changed Participants Data:** Replaced participant names with userIds to ensure consistency, as names can repeat.

## Other Suggested Optimizations for the Future

- **JWT Token for Authentication:** Replace the x-user-id header with a JWT token for better security and scalability.
- **Integration Tests for Documents:** Add integration tests to verify the functionality and correctness of document-related APIs.
- **Transaction on createTasksService:** Use transactions to ensure atomicity when creating tasks, since they are deleting meeting tasks before creating the new ones.
- **Add a better API documentation**: Use Swagger or other tool to have a better API documentation;
- **Meeting Creation Validations**: Ensure meetings are not identical, validate participants' user data, enforce future dates, and other necessary validations.
