import java.util.Set;

public class CreatePCProject {

    /**
     * Validates a PC project name according to:
     *  - Length must be between 1 and 40 characters
     *  - Single-character names may be letter, digit, or '-'
     *  - All characters must be letters, digits, spaces, or hyphens
     *  - Must not duplicate an existing project name
     */
    public static boolean isValidProjectName(String name, Set<String> existingProjects) {
        if (name == null) return false;

        int length = name.length();
        if (length < 1 || length > 40) return false;

        // If length == 1, must be letter, digit, or hyphen
        if (length == 1) {
            char c = name.charAt(0);
            if (!Character.isLetterOrDigit(c) && c != '-') return false;
        }

        // Must match only letters, digits, spaces or hyphens
        if (!name.matches("[\\w\\s\\-]+")) return false;

        // Must not duplicate an existing project name
        return !existingProjects.contains(name);
    }
}
