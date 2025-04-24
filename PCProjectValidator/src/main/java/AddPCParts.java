public class AddPCParts {


    public String addPCPart(Boolean isAddButtonClicked, boolean simulateFailure) {
        if (simulateFailure) {
            return "Error: Cannot process request due to server or network error.";
        }
        if (isAddButtonClicked == null) {
            return "Error: Unexpected error occurred. Please try again.";
        } else if (isAddButtonClicked) {
            return "PC part added successfully to your project";
        } else {
            return "Error: Invalid PC part. Cannot add to project.";
        }
    }
}
