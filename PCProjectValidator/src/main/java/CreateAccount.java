public class CreateAccount {

    // Username validation (8-20 characters, alphanumeric)
    public static String validateUsername(String username) {
        if (username == null || username.length() < 8 || username.length() > 20 || !username.matches("^[a-zA-Z0-9]*$")) {
            return "Invalid username";
        }
        return "Valid username";
    }

    // Email validation (simple format check)
    public static String validateEmail(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return "Invalid email";
        }
        return "Valid email";
    }
    

    // Password validation (8-12 characters, contains letter, digit, and special character)
    public static String validatePassword(String password) {
        if (password == null || password.length() < 8 || password.length() > 12 || !password.matches(".*[a-zA-Z].*")
                || !password.matches(".*\\d.*") || !password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            return "Invalid password";
        }
        return "Valid password";
    }

    // Account creation method
    public static String createAccount(String username, String email, String password) {
        String usernameValidation = validateUsername(username);
        String emailValidation = validateEmail(email);
        String passwordValidation = validatePassword(password);

        if (usernameValidation.equals("Valid username") && emailValidation.equals("Valid email") && passwordValidation.equals("Valid password")) {
            return "Account verification successful";
        }

        return "Error: " + usernameValidation + ", " + emailValidation + ", " + passwordValidation;
    }
}
