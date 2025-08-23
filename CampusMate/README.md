# CourseMate Backend

A comprehensive Spring Boot backend application for managing university courses, student enrollments, collaborative projects, and discussion forums.

## Project Structure

```
src/main/java/com/coursemate/coursemate/
├── config/                 # Configuration classes
│   └── SecurityConfig.java # Spring Security configuration
├── controller/             # REST API controllers
├── dto/                    # Data Transfer Objects
│   ├── request/           # Request DTOs
│   └── response/          # Response DTOs
├── entity/                 # JPA entities
├── enums/                  # Enumeration classes
├── exception/              # Exception handling
├── repository/             # Data access layer
├── security/               # Security components
│   ├── JwtAuthenticationEntryPoint.java
│   └── JwtAuthenticationFilter.java
├── service/                # Business logic services
└── CoursemateApplication.java # Main application class
```

## Features

- **User Management**: Student, Tutor, and Admin roles with authentication
- **Course Management**: Subject and course management with enrollment tracking
- **Material Management**: Course materials (videos, documents, code, etc.)
- **Discussion Forums**: Q&A system with voting and responses
- **Project Collaboration**: Team-based project management
- **JWT Authentication**: Secure API access with JWT tokens

## Technology Stack

- **Framework**: Spring Boot 3.5.5
- **Database**: PostgreSQL with Flyway migrations
- **Security**: Spring Security with JWT
- **ORM**: Spring Data JPA with Hibernate
- **Validation**: Bean Validation (Jakarta)
- **Utilities**: Lombok for boilerplate reduction

## Getting Started

1. **Prerequisites**
   - Java 17+
   - Maven 3.6+
   - PostgreSQL 12+

2. **Configuration**
   - Update `application.yml` with your database credentials
   - Set JWT secret key in environment variables

3. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

4. **API Endpoints**
   - Base URL: `http://localhost:8080/api/v1`
   - Auth endpoints: `/auth/**`
   - Public endpoints: `/public/**`

## Database Schema

The application uses Flyway for database migrations. The initial schema includes:
- Users and authentication
- Subjects and courses
- Enrollments and materials
- Queries and responses
- Projects and team management

## Security

- JWT-based authentication
- Role-based access control
- CORS configuration
- Password encryption with BCrypt
