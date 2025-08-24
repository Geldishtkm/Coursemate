package com.campusmate.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "newpassword2005cs";
        String encoded = encoder.encode(password);
        
        System.out.println("Original password: " + password);
        System.out.println("Encoded password: " + encoded);
        
        // Test if the encoded password matches
        boolean matches = encoder.matches(password, encoded);
        System.out.println("Password matches: " + matches);
        
        // Test with the hash we used in AdminUserCreator
        String oldHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa";
        boolean oldMatches = encoder.matches(password, oldHash);
        System.out.println("Old hash matches: " + oldMatches);
    }
}
