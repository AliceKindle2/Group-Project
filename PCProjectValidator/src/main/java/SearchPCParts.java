

public class SearchPCParts {

    public static String searchPCPart(String partName) {
        // Check if part name is null or empty
        if (partName == null || partName.isEmpty()) {
            return "Error: PC part name must meet length requirements";
        }

        // Check length
        if (partName.length() < 3 || partName.length() > 40) {
            return "Error: PC part name must meet length requirements";
        }

        // Check special characters (only allow letters, numbers, dash -, dot .)
        if (!partName.matches("[A-Za-z0-9-. ]+")) {
            return "Error: PC part name has special characters";
        }

        // Simulate database of existing PC parts
        String[] existingParts = {
            "cpu",
            "B450M-HDV R4.0 AMD B450 AM4 Socket Ryzen"
        };

        // Check if part exists
        boolean found = false;
        for (String part : existingParts) {
            if (part.equals(partName)) {
                found = true;
                break;
            }
        }

        if (found) {
            return "Display search results";
        } else {
            return "Error: PC part does not exist";
        }
    }
}

