import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class LogInTest {

    // Test case 1: Valid username and password
    @Test
    public void testValidLogIn() {
        String username = "User12345";
        String password = "P@ssw0rd!";
        assertEquals("Sign in successful", LogIn.login(username, password));
    }

    // Test case 2: Invalid password (missing special character)
    @Test
    public void testInvalidPassword() {
        String username = "User12345";
        String password = "password";
        assertEquals("Error: Valid username, Invalid password", LogIn.login(username, password));
    }

    // Test case 5: Empty username and valid password
    @Test
    public void testEmptyUsername() {
        String username = "";
        String password = "pass123!";
        assertEquals("Error: Invalid username, Valid password", LogIn.login(username, password));
    }

    // Test case 7: Invalid username with special characters
    @Test
    public void testInvalidUsernameWithSpecialChars() {
        String username = "User!@#";
        String password = "P@ssw0rd1!";
        assertEquals("Error: Invalid username, Valid password", LogIn.login(username, password));
    }

    // Test case 10: Valid username but short password
    @Test
    public void testShortPassword() {
        String username = "User12345";
        String password = "pass";
        assertEquals("Error: Valid username, Invalid password", LogIn.login(username, password));
    }

    // Test case 11: Invalid username (too short) and empty password
    @Test
    public void testShortUsernameEmptyPassword() {
        String username = "U1";
        String password = "";
        assertEquals("Error: Invalid username, Invalid password", LogIn.login(username, password));
    }

    // Test case 13: Username too long, empty password
    @Test
    public void testLongUsernameEmptyPassword() {
        String username = "SuperLongUsernameThatExceedsLimit";
        String password = "";
        assertEquals("Error: Invalid username, Invalid password", LogIn.login(username, password));
    }
}
