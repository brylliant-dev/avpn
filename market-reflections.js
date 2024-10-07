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

            // Get the containers where the reflections and slides will be placed
            const reflectionsContainer = document.getElementById("reflections-container");
            const slidesContainer = document.querySelector(".reflections_swiper-wrapper");

            // Get the template reflection element and slide element that will be cloned
            const templateReflection = document.getElementById('reflection');
            const templateSlide = document.getElementById('ref-slide');

            // Loop through each reflection item
            data.forEach((reflectionItem) => {
                // Clone the template reflection
                const reflection = templateReflection.cloneNode(true);

                // Clone the template slide
                const slide = templateSlide.cloneNode(true);

                // Remove the id attribute since IDs must be unique for both reflection and slide
                reflection.removeAttribute('id');
                slide.removeAttribute('id');

                // Fill in the rep name, designation, reflection, and image (if available) in reflection
                reflection.querySelector('.rep-name').textContent = reflectionItem['Rep Name'];
                reflection.querySelector('.rep-designation').textContent = reflectionItem['Rep Designation'];
                reflection.querySelector('.rep-reflection').textContent = reflectionItem['Rep Reflection'];

                // Assuming there are two image elements, select them both
                const imgElements = reflection.querySelectorAll('.rep-image');

                // Apply the same image URL to both img elements
                if (reflectionItem['Rep Image']) {
                    imgElements.forEach(img => {
                        img.src = reflectionItem['Rep Image'];
                    });
                } else {
                    // Optionally remove the image elements if the image URL is not available
                    imgElements.forEach(img => img.remove());
                }

                // Append the cloned reflection to the reflections container
                reflectionsContainer.appendChild(reflection);

                // Append the cloned slide to the swiper wrapper container
                slidesContainer.appendChild(slide);
            });

            // Optionally, remove the original template reflection and slide from the DOM if not needed
            templateReflection.remove();
            templateSlide.remove();

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
