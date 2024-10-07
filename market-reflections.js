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

            // Loop through each reflection item and assign unique ids to match
            data.forEach((reflectionItem, index) => {
                // Clone the template reflection
                const reflection = templateReflection.cloneNode(true);

                // Clone the template slide
                const slide = templateSlide.cloneNode(true);

                // Remove the id attribute from the cloned reflection and slide
                reflection.removeAttribute('id');
                slide.removeAttribute('id');

                // Set a unique data-id to match reflections with slides
                reflection.setAttribute('data-id', index);
                slide.setAttribute('data-id', index);

                // --- Populate the cloned #reflection ---
                // Set the rep-image and rep-location in the reflection
                const reflectionImg = reflection.querySelector('.rep-image');
                const reflectionLocation = reflection.querySelector('.rep-location');

                if (reflectionItem['Rep Image']) {
                    reflectionImg.src = reflectionItem['Rep Image'];
                } else {
                    reflectionImg.remove(); // Remove the image if not available
                }

                reflectionLocation.textContent = reflectionItem['Rep Designation']; // Assuming location is the designation

                // Append the cloned reflection to the reflections container
                reflectionsContainer.appendChild(reflection);

                // --- Populate the cloned #ref-slide ---
                // Set the rep-image, rep-reflection, rep-name, and rep-designation in the slide
                const slideImg = slide.querySelector('.rep-image');
                const slideReflection = slide.querySelector('.rep-reflection');
                const slideName = slide.querySelector('.rep-name');
                const slideDesignation = slide.querySelector('.rep-designation');

                if (reflectionItem['Rep Image']) {
                    slideImg.src = reflectionItem['Rep Image'];
                } else {
                    slideImg.remove(); // Remove the image if not available
                }

                slideReflection.textContent = reflectionItem['Rep Reflection'];
                slideName.textContent = reflectionItem['Rep Name'];
                slideDesignation.textContent = reflectionItem['Rep Designation'];

                // Append the cloned slide to the swiper-wrapper container for SwiperJS
                slidesContainer.appendChild(slide);

                // --- Add event listener to match #reflection with #ref-slide ---
                reflection.addEventListener('click', () => {
                    openPopup(index); // Open popup with the correct slide
                });
            });

            // Optionally, remove the original template reflection and slide from the DOM if not needed
            templateReflection.remove();
            templateSlide.remove();

            // Initialize SwiperJS after appending all slides
            const swiper = new Swiper('.reflections_swiper', {
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

// Function to open the popup and show the matching slide
function openPopup(id) {
    // Hide all slides initially
    const allSlides = document.querySelectorAll('.reflections_swiper-slide');
    allSlides.forEach(slide => {
        slide.style.display = 'none';
    });

    // Show the selected slide based on matching data-id
    const matchingSlide = document.querySelector(`.reflections_swiper-slide[data-id='${id}']`);
    if (matchingSlide) {
        matchingSlide.style.display = 'block';
    }

    // Show the popup (assuming you have a popup element)
    document.querySelector('.reflections_popup').style.display = 'block';
}

// Run the getReflections function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    getReflections();
});
