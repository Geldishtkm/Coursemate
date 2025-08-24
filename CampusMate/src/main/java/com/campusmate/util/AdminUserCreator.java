package com.campusmate.util;

import com.campusmate.entity.User;
import com.campusmate.enums.UserRole;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

/**
 * Utility class to create admin user in the database
 * Run this class directly to create the admin user
 */
public class AdminUserCreator {
    
    private static final String DB_URL = "jdbc:postgresql://localhost:5432/CampusMate";
    private static final String DB_USER = "postgres";
    private static final String DB_PASSWORD = "newpassword"; // Your actual PostgreSQL password
    
    public static void main(String[] args) {
        AdminUserCreator creator = new AdminUserCreator();
        creator.createAdminUser();
    }
    
    public void createAdminUser() {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            
            // Check if admin user already exists
            if (adminUserExists(connection)) {
                System.out.println("Admin user already exists!");
                return;
            }
            
            // Create admin user
            createAdmin(connection);
            System.out.println("Admin user created successfully!");
            
        } catch (SQLException e) {
            System.err.println("Error creating admin user: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private boolean adminUserExists(Connection connection) throws SQLException {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, "orazovgeldymurad@gmail.com");
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }
    
    private void createAdmin(Connection connection) throws SQLException {
        String sql = "INSERT INTO users (id, first_name, last_name, email, password, role, student_id, department, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, UUID.randomUUID().toString());
            stmt.setString(2, "Admin");
            stmt.setString(3, "User");
            stmt.setString(4, "orazovgeldymurad@gmail.com");
            stmt.setString(5, new BCryptPasswordEncoder().encode("newpassword2005cs"));
            stmt.setString(6, "ADMIN");
            stmt.setString(7, "ADMIN001");
            stmt.setString(8, "System Administration");
            stmt.setBoolean(9, true);
            
            stmt.executeUpdate();
        }
    }
}
