// Create a variable for the JSON file URL
let reflectionsUrl = new URL('https://brylliant-dev.github.io/avpn/market-reflections.json');

// Define a function to get reflections data
function getReflections() {
    // Create a request variable and assign a new XMLHttpRequest object to it
    let request = new XMLHttpRequest();

    // Convert the URL object to a string
    let url = reflectionsUrl.toString();

    // Open a GET request to the URL
    request.open('GET', url, true);

    // Define what happens when the request loads
    request.onload = function() {
        // Parse the JSON response into a JavaScript object
        let data = JSON.parse(this.response);

        // Check if the request was successful
        if (request.status >= 200 && request.status < 400) {
            // Sort reflections by ID
            data.sort((a, b) => a.ID - b.ID);

            // Get the container where the reflections will be placed
            const reflectionsContainer = document.getElementById("reflections-container");

            // Get the template reflection element that will be cloned
            const templateReflection = document.getElementById('reflection');

            // Loop through each reflection item
            data.forEach((reflectionItem) => {
                // Clone the template reflection
                const reflection = templateReflection.cloneNode(true);

                // Remove the id attribute since IDs must be unique
                reflection.removeAttribute('id');

                // Fill in the rep name, designation, location, reflection, and image (if available)
                reflection.querySelector('.rep-name').textContent = reflectionItem['Rep Name'];
                reflection.querySelector('.rep-designation').textContent = reflectionItem['Rep Designation'];
                reflection.querySelector('.rep-location').textContent = reflectionItem['Rep Location']; // Assuming location field
                reflection.querySelector('.rep-reflection').textContent = reflectionItem['Rep Reflection'];

                // Assuming there's a rep image, set the src if the field exists
                const img = reflection.querySelector('.rep-image');
                if (reflectionItem['Rep Image']) {
                    img.src = reflectionItem['Rep Image'];
                } else {
                    img.remove(); // Optionally remove the image element if not available
                }

                // Append the cloned reflection to the container
                reflectionsContainer.appendChild(reflection);
            });

            // Optionally, remove the original template reflection from the DOM if not needed
            templateReflection.remove();

            // Reinitialize Webflow interactions to ensure animations apply to the new elements
            Webflow.require('ix2').init();
        }
    };

    // Send the request to load the reflections data
    request.send();
}

// Run the getReflections function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    getReflections();
});
