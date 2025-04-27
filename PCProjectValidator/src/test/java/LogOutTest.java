import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class LogOutTest {

    @Test
    void logOut_TC1() {
        assertEquals(LogOut.logOut(true, true), "Successfully Logged out");
    }

    @Test
    void logOut_TC2() {
        assertEquals(LogOut.logOut(true, false), "Error: Could not log out, please try again later");
    }

    @Test
    void logOut_TC3() {
        assertEquals(LogOut.logOut(true, null), "Error: please click Confirm button once to log out");
    }

    @Test
    void logOut_TC4() {
        assertEquals(LogOut.logOut(false, true), "Session expired");
    }

    @Test
    void logOut_TC7() {
        assertEquals(LogOut.logOut(null, true), "Error: please click Log Out button once to log out");
    }
}
