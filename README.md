
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

2. The application will be accessible at localhost, on port 3000.

### Running Tests

To run the tests, execute:

```bash
docker exec -it nest-app-container npm t
```

## Explaining decisions

- **Used [NestJS](https://nestjs.com/):** Chose NestJS for its extensive documentation, ease of use, and good architecture.
- **Created Meeting and Task Modules:** Organized the code by separating it into domains (Meeting and Task), making the application better organized and easier to scale.
- **Containerization:** Used Docker to containerize MongoDB and the application itself for easy setup and configuration.
- **Added [@nestjs/mongoose](https://www.npmjs.com/package/@nestjs/mongoose):** Integrated Mongoose for MongoDB data modeling and validation in the NestJS framework.
- **Authentication Middleware:** Applied authentication middleware across all layers to ensure security at every level.
- **Mapped Application Errors:** Created a MeetingError class to provide a better error handling system with an error enum for clients.
- **Granular Services:** Split services into smaller, more manageable classes with single responsibilities for better readability and maintenance.
- **Input Validation:** Used class-validator to ensure proper input/payload validation for API requests.
- **Try/Catch in Controllers:** Wrapped controller code in try/catch blocks to handle exceptions thrown from deeper layers.
- **Fixed Security Breach:** Added validation to prevent users from accessing or modifying data from other users.
- **Changed PUT to PATCH:** Updated the /api/meetings/:id/transcript endpoint to PATCH, as it only updates part of the resource.
- **Barrel Imports:** Implemented barrel imports to simplify module imports and improve code organization.
- **Absolute Paths:** Configured absolute paths to simplify imports and easier handling of files.
- **Mock AI Implementation:** Created a mock implementation for AI, with comments indicating where AI would be used.
- **Added Duration Field in Meeting:** Added a duration field in the meeting model to better support the dashboard functionality (could be done with an endDate field as well).
- **Changed Participants Data:** Replaced participant names with userIds to ensure consistency, as names can repeat.

## Suggested Optimizations for the Future

- **JWT Token for Authentication:** Replace the x-user-id header with a JWT token for better security and scalability.
- **Filters on Get Tasks API:** Implement filters for the GET /tasks API to filter tasks by meeting, status, etc.
- **Pagination on Get Many Meetings and Tasks APIs:** Add pagination for the GET /meetings and GET /tasks APIs to improve performance with large datasets.
- **Integration Tests for Documents:** Add integration tests to verify the functionality and correctness of document-related APIs.
- **Transaction on createTasksService:** Use transactions to ensure atomicity when creating tasks, since they are deleting meeting tasks before creating the new ones.
- **Meeting Dashboard Scaling:** Noted that the meeting dashboard might not scale well with a large number of meetings; recommended using a data lake for better reporting.
- **Add a better API documentation**: Use Swagger or other tool to have a better API documentation;


## API Endpoints Documentation

### 1. **Get Meetings**

**Request**

```bash
curl --location --request GET 'http://localhost:3000/api/meetings' \
--header 'x-user-id: user10'
```

**Response**

```json
[
    {
        "_id": "676743999c801bcfe9529968",
        "userId": "user10",
        "title": "Meeting 1",
        "date": "2024-08-06T19:45:47.412Z",
        "duration": 24,
        "transcript": "This is a sample transcript for meeting 1.",
        "summary": "Summary of meeting 1",
        "participantsCount": 2
    }
]
```

### 2. **Create Meeting**

**Request**

```bash
curl --location --request POST 'http://localhost:3000/api/meetings' \
--header 'x-user-id: user4' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "test",
    "date": "2024-12-12 10:00",
    "participants": ["a", "b"],
    "duration": 30
}'
```

**Response**

```json
{
    "userId": "user4",
    "title": "test",
    "date": "2024-12-12T10:00:00.000Z",
    "duration": 30,
    "_id": "676744eeba245a8b5dc93d38",
    "participantsCount": 2
}
```

### 3. **Get a single Meeting**

**Request**

```bash
curl --location --request GET 'http://localhost:3000/api/meetings/676744ce332acab857cbc1cf' \
--header 'x-user-id: user3'
```

**Response**

```json
{
    "_id": "676744ce332acab857cbc1cf",
    "userId": "user4",
    "title": "Meeting 1",
    "date": "2023-09-07T21:35:30.124Z",
    "duration": 58,
    "transcript": "This is a sample transcript for meeting 1.",
    "summary": "Summary of meeting 1",
    "tasks": [
        {
            "_id": "676744ce332acab857cbc235",
            "meetingId": "676744ce332acab857cbc1cf",
            "userId": "user4",
            "title": "Task 1 from Meeting 1",
            "description": "This is a sample task from meeting Meeting 1",
            "status": "pending",
            "dueDate": "2023-09-13T09:45:50.135Z",
        },
        {
            "_id": "676744ce332acab857cbc236",
            "meetingId": "676744ce332acab857cbc1cf",
            "userId": "user4",
            "title": "Task 2 from Meeting 1",
            "description": "This is a sample task from meeting Meeting 1",
            "status": "completed",
            "dueDate": "2023-09-13T12:22:27.935Z",
        }
    ],
    "participantsCount": 3
}
```

### 4. **Update a meeting transcript**

**Request**

```bash
curl --location --request PATCH 'http://localhost:3000/api/meetings/676744ce332acab857cbc1cf/transcript' \
--header 'x-user-id: user4' \
--header 'Content-Type: application/json' \
--data-raw '{
    "transcript": "new transcript"
}'
```

**Response**

```css
HTTP/1.1 204 No Content
```

### 5. **Summarize a meeting**

**Request**

```bash
curl --location --request POST 'http://localhost:3000/api/meetings/676744ce332acab857cbc1cf/summarize' \
--header 'x-user-id: user4'
```

**Response**

```css
HTTP/1.1 204 No Content
```

### 6. **Get User Tasks**

**Request**

```bash
curl --location --request GET 'http://localhost:3000/api/tasks' \
--header 'x-user-id: user4'
```

**Response**

```json
[
    {
        "_id": "676744ce332acab857cbc24c",
        "meetingId": "676744ce332acab857cbc1d9",
        "userId": "user4",
        "title": "Task 1 from Meeting 11",
        "description": "This is a sample task from meeting Meeting 11",
        "status": "completed",
        "dueDate": "2023-12-16T12:41:58.573Z",
        "__v": 0
    },
]
```

### 7. **Meeting Stats**

**Request**

```bash
curl --location --request GET 'http://localhost:3000/api/meetings/stats' \
--header 'x-user-id: user4'
```

**Response**

```json
{
    "generalStats": {
        "totalMeetings": 100,
        "totalParticipants": 364,
        "totalDuration": 6406,
        "shortestMeeting": 15,
        "longestMeeting": 119,
        "averageParticipants": 3.64,
        "averageDuration": 64.06
    },
    "topParticipants": [
        {
            "meetingCount": 44,
            "participant": "Jack"
        },
        {
            "meetingCount": 41,
            "participant": "Henry"
        },
        {
            "meetingCount": 40,
            "participant": "Bob"
        },
        {
            "meetingCount": 40,
            "participant": "Alice"
        },
        {
            "meetingCount": 40,
            "participant": "Eva"
        }
    ],
    "meetingsByDayOfWeek": [
        {
            "count": 10,
            "dayOfWeek": 1
        },
        {
            "count": 19,
            "dayOfWeek": 2
        },
        {
            "count": 19,
            "dayOfWeek": 3
        },
        {
            "count": 16,
            "dayOfWeek": 4
        },
        {
            "count": 14,
            "dayOfWeek": 5
        },
        {
            "count": 14,
            "dayOfWeek": 6
        },
        {
            "count": 8,
            "dayOfWeek": 7
        }
    ]
}
```