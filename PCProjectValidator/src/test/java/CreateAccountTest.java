import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class CreateAccountTest {

    // Test case 1: Valid username, email, and password
    @Test
    public void testValidAccountCreation() {
        String username = "User12345";
        String email = "user.name@example.com";
        String password = "P@ssw0rd1!";
        assertEquals("Account verification successful", CreateAccount.createAccount(username, email, password));
    }

    // Test case 2: Invalid password (missing special character)
    @Test
    public void testInvalidPasswordCreateAccount() {
        String username = "User12345";
        String email = "user.name@example.com";
        String password = "password";
        assertEquals("Error: Valid username, Valid email, Invalid password", CreateAccount.createAccount(username, email, password));
    }

    // Test case 4: NULL username and valid email/password
    @Test
    public void testNullUsername() {
        String username = null;
        String email = "user.name@example.com";
        String password = "password123!";
        assertEquals("Error: Invalid username, Valid email, Valid password", CreateAccount.createAccount(username, email, password));
    }

    // Test case 7: Invalid email format and valid username/password
    @Test
    public void testInvalidEmail() {
        String username = "User12345";
        String email = "user@invalid";
        String password = "P@ssw0rd11!";
        assertEquals("Error: Valid username, Invalid email, Valid password", CreateAccount.createAccount(username, email, password));
    }

    // Test case 10: Invalid username with special characters and invalid password
    @Test
    public void testInvalidUsernameAndPassword() {
        String username = "User!@#";
        String email = "user.name@example.com";
        String password = "pass123";
        assertEquals("Error: Invalid username, Valid email, Invalid password", CreateAccount.createAccount(username, email, password));
    }

    // Test case 12: All fields null
    @Test
    public void testAllFieldsNull() {
        String username = null;
        String email = null;
        String password = "pass";
        assertEquals("Error: Invalid username, Invalid email, Invalid password", CreateAccount.createAccount(username, email, password));
    }
}
