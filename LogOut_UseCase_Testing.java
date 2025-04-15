/**
 * Author: Amy Valdivia
 * Section: CS 3354.005
 * Date: 3 April 2025
 * Professor: Priya Narayanasami
 * Purpose: Use case testing for Search for PC Part use case for Phase 4
 */

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class LogOut_UseCase_Testing {
    /**
     * valid:
     *  satisfies all the conditions
     *  - user is authenticated (already signed in to their account)
     *  - Log Out button was clicked (true)
     *
     *  invalid:
     *  - Log Out button is clicked multiple times, request could not be processed (null)
     *  - Confirm button is clicked multiple times, request could not be processed (null)
     *  - Log Out or Confirm buttons were not pressed due to session expiring or server error (false)
     */

    @Test
    void logOut_TC1(){
        //all values are valid
        assertEquals(Logout1.logOut(true, true), "Successfully Logged out");
    }

    @Test
    void logOut_TC2(){
        //Log Out pressed, but server error encountered when trying to confirm
        assertEquals(Logout1.logOut(true, false), "Error: Could not log out, please try again later");
    }

    @Test
    void logOut_TC3(){
        //Log Out pressed, but Confirm pressed multiple times
        assertEquals(Logout1.logOut(true, null), "Error: please click Confirm button once to log out");
    }

    @Test
    void logOut_TC4(){
        //Log Out was not pressed due to session expired or server error
        assertEquals(Logout1.logOut(false, true), "Session expired");
    }

    @Test
    void logOut_TC7(){
        //Log Out pressed multiple times
        assertEquals(Logout1.logOut(null, true), "Error: please click Log Out button once to log out");
    }
}
