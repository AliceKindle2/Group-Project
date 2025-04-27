public class LogIn {

    // Username validation (8-20 characters, alphanumeric)
    public static String validateUsername(String username) {
        if (username == null || username.length() < 8 || username.length() > 20 || !username.matches("^[a-zA-Z0-9]*$")) {
            return "Invalid username";
        }
        return "Valid username";
    }

    // Password validation (8-12 characters, contains letter, digit, and special character)
    public static String validatePassword(String password) {
        if (password == null || password.length() < 8 || password.length() > 12 || !password.matches(".*[a-zA-Z].*")
                || !password.matches(".*\\d.*") || !password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            return "Invalid password";
        }
        return "Valid password";
    }

    // LogIn method
    public static String login(String username, String password) {
        String usernameValidation = validateUsername(username);
        String passwordValidation = validatePassword(password);

        if (usernameValidation.equals("Valid username") && passwordValidation.equals("Valid password")) {
            return "Sign in successful";
        }

        return "Error: " + usernameValidation + ", " + passwordValidation;
    }
}
