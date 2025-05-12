package com.HireFire.HireFireBackend;

import java.sql.DriverManager;

public class TestDriver {
    public static void main(String[] args) {
        try {
            Class.forName("org.sqlite.JDBC");
            System.out.println("SQLite JDBC Driver is loaded successfully!");
        } catch (ClassNotFoundException e) {
            System.out.println("SQLite JDBC Driver not found!");
            e.printStackTrace();
        }
    }
}
