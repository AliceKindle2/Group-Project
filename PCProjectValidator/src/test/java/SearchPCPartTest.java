import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class SearchPCPartTest {
    /**
     * valid:
     *  satisfies all the conditions
     *  - length must be between 3 and 40 characters
     *  - is an existing PC part
     *
     *  invalid:
     *  - PC part name does not satisfy length requirement
     *  - PC part name is empty
     *  - PC part does not exist
     *  - PC part name has a special character that is not "-" or "."
     */

    @Test
    void searchPCPart_TC1(){
        //PC part name is valid (length is 3)
        assertEquals(SearchPCParts.searchPCPart("cpu"), "Display search results");
    }

    @Test
    void searchPCPart_TC1a(){
        //PC part name is valid (length is 40)
        assertEquals(SearchPCParts.searchPCPart("B450M-HDV R4.0 AMD B450 AM4 Socket Ryzen"), "Display search results");
    }

    @Test
    void searchPCPart_TC2(){
        //PC part name is invalid (has a length of 2)
        assertEquals(SearchPCParts.searchPCPart("cp"), "Error: PC part name must meet length requirements");
    }

    @Test
    void searchPCPart_TC2a(){
        //PC part name is invalid (has a length of 3 but does not exist)
        assertEquals(SearchPCParts.searchPCPart("xpu"), "Error: PC part does not exist");
   }

   @Test
    void searchPCPart_TC3(){
        //PC part name has an exception (is empty)
        assertEquals(SearchPCParts.searchPCPart(""), "Error: PC part name must meet length requirements");
    }

    @Test
    void searchPCPart_TC3a(){
        //PC part name has an exception (has a large length)
        assertEquals(SearchPCParts.searchPCPart("ASUS ROG Strix B850-E Gaming WiFi AMD AM5 B850 ATX Motherboard 16+2+2 Stages, Dynamic OC, Core Flex, …”"), "Error: PC part name must meet length requirements");
    }

    @Test
    void searchPCPart_TC3b(){
        //PC part name has an exception (has a length of 40 but has a special character)
        assertEquals(SearchPCParts.searchPCPart("Desktop 9000 8000 & 7000 ATX Motherboard"), "Error: PC part name has special characters");
    }
    
}
