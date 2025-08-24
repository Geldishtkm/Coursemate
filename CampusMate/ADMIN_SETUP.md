# Admin User Setup

## Default Admin Credentials

The system requires an admin user to be created manually. Here are the admin credentials:

**Admin Login Details:**
- **Email:** `orazovgeldymurad@gmail.com`
- **Password:** `newpassword2005cs`
- **Role:** `ADMIN`
- **Name:** Admin User
- **Student ID:** ADMIN001
- **Department:** System Administration

## How to Create Admin User

### Method 1: SQL Script (Recommended)

1. **Open your PostgreSQL database** (using pgAdmin, psql, or any database client)
2. **Run the SQL script** `create-admin-user.sql` located in the project root
3. **Verify the user was created** by checking the users table

### Method 2: Java Utility Class

1. **Update database credentials** in `AdminUserCreator.java` if needed
2. **Run the Java class** directly: `AdminUserCreator.main()`
3. **Check console output** for success/error messages

### Method 3: REST API Endpoint

1. **Start the backend** application
2. **Call the endpoint:** `POST http://localhost:8080/admin/init`
3. **Check response** for success/error messages

## Database Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** campusmate
- **Username:** postgres
- **Password:** postgres (change this to your actual password)

## How It Works

1. **Manual Creation:** Admin user must be created manually (no public signup)
2. **Role-Based Access:** Only users with `ADMIN` role can:
   - Create courses
   - Edit courses
   - Delete courses
   - Access the Admin Panel
3. **Security:** Admin password is properly encoded using BCrypt

## Testing Admin Access

1. **Create the admin user** using one of the methods above
2. **Start the application** (frontend and backend)
3. **Navigate to `/login`**
4. **Use the admin credentials** above
5. **Verify admin access** - you should see "Admin Panel" in navigation
6. **Access `/admin`** to reach the Admin Dashboard
7. **Test course creation** and management

## Troubleshooting

### Admin User Not Created
- Check database connection
- Verify database credentials
- Check application logs for errors
- Ensure the users table exists

### Cannot Login as Admin
- Verify admin user exists in database
- Check password encoding
- Ensure backend is running
- Check authentication configuration

### No Admin Panel Access
- Verify user role is set to "ADMIN"
- Check if user is properly authenticated
- Restart the application after creating admin user

## Security Notes

- The admin password is pre-encoded using BCrypt
- Only authenticated users with ADMIN role can perform administrative actions
- The system automatically checks user roles before allowing course management operations
- TUTOR role users can still be created for professors but cannot manage courses
