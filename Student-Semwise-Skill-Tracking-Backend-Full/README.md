# Student Sem-Wise Skill Tracking System

Backend for the Student Sem-Wise Skill Tracking System.

## Technology

- Java
- Spring Boot
- PostgreSQL
- Spring Data JPA
- Maven

## Database

Database name: `student_tracker`

The database password is stored safely in the Windows environment variable:

`DB_PASSWORD`

It is not stored in this project.

## Run

1. Open the project in IntelliJ IDEA.
2. Make sure PostgreSQL is running.
3. Make sure `DB_PASSWORD` is set in Windows.
4. Run the Spring Boot application.
5. Open:

`http://localhost:8080/api/health`

If everything is working, it shows:

```json
{
  "service": "student-semwise-skill-tracking-backend",
  "status": "UP"
}