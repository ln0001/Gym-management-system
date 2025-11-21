# GYM Management System

An online application to manage gym operations, replacing paper receipts and manual notifications with a digital solution.

## Problem Statement

Payment receipts at many Gyms are printed on paper. As a result, keeping all of the paper receipts safe is tough for both gym members and gym trainers. When members misplace their receipts, it might cause problems. Another issue that a gym owner may have is that manually distributing messages about the gym's working and non-working days becomes tough. These issues can be solved if there is an online application available.

## Features

### Admin Module
- Login
- Add Member
- Update/Delete Members
- Create Bills
- Assign Fee Package
- Assign Notification for monthly
- Report export
- Supplement store
- Diet Details

### Members Module
- Login
- View Bill Receipts
- View bill notification

### User Module
- Login
- View details
- Search records

## Technology Stack

- **Frontend**: React.js (HTML, CSS, JavaScript)
- **Backend**: Spring Boot (Java)
- **Database**: MySQL 8 (Spring Data JPA)
- **UI**: Modern, aesthetic, and simple design

## Project Structure

```
GYM_project/
├── frontend/          # React.js application
├── backend/          # Spring Boot application
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Java JDK 17 or higher
- Maven 3.6+
- MySQL 8.0+ server (database: `gym_db`, username: `root`, password: `Narayan@123`)

### Backend Setup
```bash
cd backend
```

1. Ensure MySQL is running and a database named `gym_db` exists:
   ```sql
   CREATE DATABASE IF NOT EXISTS gym_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Update `backend/src/main/resources/application.properties` if your MySQL credentials differ. Defaults:
   - URL: `jdbc:mysql://localhost:3306/gym_db`
   - Username: `root`
   - Password: `Narayan@123`
3. Build & run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

The backend will run on `http://localhost:8080`

## Features Implemented

### Admin Module ✅
- ✅ Login
- ✅ Add Member
- ✅ Update/Delete Members
- ✅ Create Bills
- ✅ Assign Fee Package
- ✅ Assign Notification for monthly
- ✅ Report export
- ✅ Supplement store
- ✅ Diet Details

### Members Module ✅
- ✅ Login
- ✅ View Bill Receipts
- ✅ View bill notification

### User Module ✅
- ✅ Login
- ✅ View details
- ✅ Search records

## Project Structure

```
GYM_project/
├── frontend/              # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/    # Admin dashboard and features
│   │   │   ├── Member/   # Member dashboard and features
│   │   │   ├── User/     # User dashboard and features
│   │   │   └── Auth/     # Authentication components
│   │   ├── config/       # Optional client configuration helpers
│   │   ├── api/          # Axios client helpers
│   │   ├── context/      # React context (Auth)
│   │   └── App.js
│   └── package.json
├── backend/              # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/gym/
│   │   │   │   ├── config/    # Configuration classes
│   │   │   │   ├── controller/# REST controllers
│   │   │   │   ├── service/   # Business logic
│   │   │   │   ├── dto/       # Data Transfer Objects
│   │   │   │   └── util/      # Utility classes
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
└── README.md
```

## Code Standards

- **Modular**: Code written in modular fashion
- **Safe**: Can be used without causing harm
- **Testable**: Can be tested at the code level
- **Maintainable**: Can be maintained as codebase grows
- **Portable**: Works the same in every environment

## Database

The system uses a MySQL database (`gym_db`) accessed through Spring Data JPA repositories. Key tables include:

- `user_accounts` & `members` for identity and profile management
- `bills`, `fee_packages`, `notifications`, `diet_plans`, and `supplements` for operational data
- `activity_logs` for audit history

## Logging

Login and activity events are stored in the `activity_logs` table and also written to `backend/logs/gym-management.log`. Each log entry captures the user identifier, action, details, and timestamp.

## Development Notes

### Code Standards
- **Modular**: Code is organized in separate modules/components
- **Safe**: Input validation and error handling implemented
- **Testable**: Components and services are structured for testing
- **Maintainable**: Clean code structure with separation of concerns
- **Portable**: Works across different operating systems

### Database Tables Overview
- `user_accounts` - Application users and roles
- `members` - Gym member profiles with assigned packages
- `bills` - Billing and payment status
- `fee_packages` - Subscription plans and pricing
- `notifications` - Broadcast announcements
- `supplements` - Store inventory
- `diet_plans` - Nutrition plans
- `activity_logs` - User activity audit trail

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with descriptive messages
5. Push to your branch
6. Create a Pull Request

## License

This project is maintained on GitHub as a public repository.

