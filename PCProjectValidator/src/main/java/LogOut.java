public class LogOut {

    public boolean isLoggedOut;

    public LogOut() {    // constructor, no void
        this.isLoggedOut = false;
    }

    public boolean getLogout() {
        this.isLoggedOut = true;
        return true;
    }

    public void print() {
        if (isLoggedOut) {
            System.out.println("Logout successful!");
        } else {
            System.out.println("Still logged in.");
        }
    }

    public void clearSession() {
        System.out.println("Cleared user session.");
    }

    public static String logOut(Boolean logOutButton, Boolean confirmButton) {
        if (logOutButton == null) {
            return "Error: please click Log Out button once to log out";
        }
        if (confirmButton == null) {
            return "Error: please click Confirm button once to log out";
        }
        if (!logOutButton) {
            return "Session expired";
        }
        if (!confirmButton) {
            return "Error: Could not log out, please try again later";
        }
        return "Successfully Logged out";
    }
}
