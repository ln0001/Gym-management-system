# GYM Management System - Backend

Spring Boot backend API for the GYM Management System.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ with a database named `gym_db`

## Setup

1. **Install Dependencies**
   ```bash
   mvn clean install
   ```

2. **Database Configuration**
   - Ensure MySQL is running and a schema named `gym_db` exists
   - Update `src/main/resources/application.properties` if your credentials differ
   - Default credentials: username `root`, password `Narayan@123`

3. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

   Or run the main class:
   ```bash
   java -jar target/gym-management-system-1.0.0.jar
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Configuration

The application runs on port 8080 by default. You can change this in `application.properties`.

## Logging

All login activities are persisted to:
- MySQL table `activity_logs`
- Application log file: `logs/gym-management.log`

## Building

```bash
mvn clean package
```

This will create a JAR file in the `target` directory.

