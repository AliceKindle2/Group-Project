import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class CreatePCProjectTest {

    // Simulate an existing project in the user's account
    private final Set<String> existingProjects = new HashSet<>(Set.of("Existing Project"));

    // Valid Cases

    @Test
    void testValidSingleCharacter() {
        assertTrue(CreatePCProject.isValidProjectName("F", existingProjects));
    }

    @Test
    void testValidMaxLengthName() {
        String name = "A".repeat(40); // Exactly 40 characters
        assertTrue(CreatePCProject.isValidProjectName(name, existingProjects));
    }

    // Invalid Cases

    @Test
    void testTooLongName() {
        String name = "This PC Project Name xxxxxxxx is too long"; // > 40 chars
        assertFalse(CreatePCProject.isValidProjectName(name, existingProjects));
    }

    @Test
    void testEmptyName() {
        assertFalse(CreatePCProject.isValidProjectName("", existingProjects));
    }

    @Test
    void testSpecialCharacterInName() {
        String name = "PC Project Name has special character $";
        assertFalse(CreatePCProject.isValidProjectName(name, existingProjects));
    }

    // Exceptional Cases

    @Test
    void testExceptionallyLongName() {
        String name = "This PC Project Name xxxxxxxxxxxxxxxxxxxxxxxxxx is exceptionally long"; // >> 40
        assertFalse(CreatePCProject.isValidProjectName(name, existingProjects));
    }

    @Test
    void testOneCharacterSpecialChar() {
        assertFalse(CreatePCProject.isValidProjectName("$", existingProjects));
    }

    @Test
    void testDuplicateProjectName() {
        assertFalse(CreatePCProject.isValidProjectName("Existing Project", existingProjects));
    }
}
