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
            // Custom sorting order for specific locations
            const customOrder = [
                'Global Markets, Australia, and New Zealand',
                'Southeast Asia',
                'South Asia',
                'Northeast Asia',
                'West Asia'
            ];

            // Sort the data with the custom order first, then alphabetically for the rest
            data.sort((a, b) => {
                let locationA = a['Rep Location'];
                let locationB = b['Rep Location'];
                let indexA = customOrder.indexOf(locationA);
                let indexB = customOrder.indexOf(locationB);

                if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                }
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return locationA.localeCompare(locationB);
            });

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
                const slide = templateSlide.cloneNode(true);

                // Remove the id attribute from the cloned elements
                reflection.removeAttribute('id');
                slide.removeAttribute('id');

                // Set a unique data-id attribute based on the index
                reflection.setAttribute('data-id', index);
                slide.setAttribute('data-id', index);

                // Populate reflection content
                const reflectionImg = reflection.querySelector('.rep-image');
                const reflectionLocation = reflection.querySelector('.rep-location');
                if (reflectionItem['Rep Image']) {
                    reflectionImg.src = reflectionItem['Rep Image'];
                } else {
                    reflectionImg.remove();
                }
                reflectionLocation.textContent = reflectionItem['Rep Location'];
                reflection.style.display = 'flex';
                reflectionsContainer.appendChild(reflection);

                // Populate slide content
                const slideImg = slide.querySelector('.rep-image');
                const slideReflection = slide.querySelector('.rep-reflection');
                const slideName = slide.querySelector('.rep-name');
                const slideDesignation = slide.querySelector('.rep-designation');
                if (reflectionItem['Rep Image']) {
                    slideImg.src = reflectionItem['Rep Image'];
                } else {
                    slideImg.remove();
                }
                slideReflection.textContent = reflectionItem['Rep Reflection'];
                slideName.textContent = reflectionItem['Rep Name'];
                slideDesignation.textContent = reflectionItem['Rep Designation'];
                slide.style.display = 'flex';
                slidesContainer.appendChild(slide);

                // Add event listener for each reflection to open the popup
                reflection.addEventListener('click', () => {
                    openPopup(index); // Match the popup with the correct slide
                });
            });

            // Optionally remove the original templates
            templateReflection.remove();
            templateSlide.remove();

            // Initialize SwiperJS after appending all slides
            const swiper = new Swiper('.reflections_swiper', {
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                slidesPerView: 1,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                loop: false,
                observer: true,
                observeParents: true,
            });

            // Function to open the popup and set the Swiper to the matching slide
            function openPopup(index) {
                swiper.slideTo(index, 0);
                document.querySelector('.reflections_popup').style.display = 'block';
            }

            // Use setTimeout to reset Webflow interactions
            resetInteractions();
        }
    };

    // Send the request to load the reflections data
    request.send();
}

// Function to reset Webflow interactions using setTimeout
function resetInteractions() {
  setTimeout(() => {
    Webflow.require('ix2').init();
  }, 100); // Adjust delay as needed
}

// Run the getReflections function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    getReflections();
});
