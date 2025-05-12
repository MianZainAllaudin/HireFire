package com.HireFire.HireFireBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HireFireBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(HireFireBackendApplication.class, args);
		//here, we will connect to our front end, then after sign in we will determine the account
		//lets say it is customer, we will then make a customer object here, retrieve data from
		//the database and put it into the customer object, then send that customer object to
		//the front end for functioning of stuff


		//now I dont know if we can actually do this, or do this to how much of extent
	}
}
