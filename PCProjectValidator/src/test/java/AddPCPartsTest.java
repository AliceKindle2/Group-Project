import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AddPCPartsTest {

    AddPCParts addPCParts = new AddPCParts();

    // Test Case 1: Valid input
    @Test
    public void testAddPCPart_Valid() {
        String result = addPCParts.addPCPart(true, false);
        assertEquals("PC part added successfully to your project", result);
    }

    // Test Case 2: Invalid input
    @Test
    public void testAddPCPart_Invalid() {
        String result = addPCParts.addPCPart(false, false);
        assertEquals("Error: Invalid PC part. Cannot add to project.", result);
    }

    // Test Case 3: Exceptional - null (multiple clicks)
    @Test
    public void testAddPCPart_Exceptional_Null() {
        String result = addPCParts.addPCPart(null, false);
        assertEquals("Error: Unexpected error occurred. Please try again.", result);
    }

    // Test Case 4: Exceptional - network/server failure
    @Test
    public void testAddPCPart_Exceptional_ServerError() {
        String result = addPCParts.addPCPart(true, true); // simulate failure
        assertEquals("Error: Cannot process request due to server or network error.", result);
    }
}
