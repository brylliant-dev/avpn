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

                // Remove the id attribute from the cloned reflection and slide
                reflection.removeAttribute('id');
                slide.removeAttribute('id');

                // Fill in the rep name, designation, location, and reflection in reflection
                reflection.querySelector('.rep-name').textContent = reflectionItem['Rep Name'];
                reflection.querySelector('.rep-designation').textContent = reflectionItem['Rep Designation'];
                reflection.querySelector('.rep-location').textContent = reflectionItem['Rep Designation']; // Assuming Rep Designation is also the location
                reflection.querySelector('.rep-reflection').textContent = reflectionItem['Rep Reflection'];

                // Apply the same image URL to the image elements
                const imgElements = reflection.querySelectorAll('.rep-image');
                if (reflectionItem['Rep Image']) {
                    imgElements.forEach(img => {
                        img.src = reflectionItem['Rep Image'];
                    });
                } else {
                    imgElements.forEach(img => img.remove()); // Remove if image not available
                }

                // Append the cloned reflection to the reflections container
                reflectionsContainer.appendChild(reflection);

                // Now populate the cloned slide for SwiperJS
                const slideImage = slide.querySelector('.rep-image');
                const slideReflection = slide.querySelector('.rep-reflection');
                const slideName = slide.querySelector('.rep-name');
                const slideDesignation = slide.querySelector('.rep-designation');

                // Update the content of the cloned slide
                if (reflectionItem['Rep Image']) {
                    slideImage.src = reflectionItem['Rep Image'];
                } else {
                    slideImage.remove(); // Remove the image if not available
                }
                slideReflection.textContent = reflectionItem['Rep Reflection'];
                slideName.textContent = reflectionItem['Rep Name'];
                slideDesignation.textContent = reflectionItem['Rep Designation'];

                // Append the cloned slide to the swiper-wrapper container for SwiperJS
                slidesContainer.appendChild(slide);
            });

            // Optionally, remove the original template reflection and slide from the DOM if not needed
            templateReflection.remove();
            templateSlide.remove();

            // Initialize SwiperJS after appending all slides
            new Swiper('.reflections_swiper', {
                slidesPerView: 1,
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                loop: true, // Optional: if you want an infinite loop
            });

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
