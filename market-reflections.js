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
            // Custom sorting order for 'Rep Location'
            const locationOrder = [
                'Global Markets, Australia, and New Zealand',
                'Southeast Asia',
                'South Asia',
                'Northeast Asia',
                'West Asia',
                'Bangladesh',
                'China',
                'Europe, United Kingdom',
                'Hong Kong SAR China',
                'India',
                'Indonesia',
                'Japan',
                'Malaysia',
                'Mekong Region',
                'Philippines',
                'Singapore',
                'South Korea',
                'Taiwan',
                'Vietnam'
            ];

            // Sort the data based on the custom location order
            data.sort((a, b) => {
                let locationA = a['Rep Location'];
                let locationB = b['Rep Location'];

                return locationOrder.indexOf(locationA) - locationOrder.indexOf(locationB);
            });

            // Get the containers where the reflections and slides will be placed
            const reflectionsContainer = document.getElementById("reflections-container");
            const slidesContainer = document.querySelector(".reflections_swiper-wrapper");

            // Get the template reflection element and slide element that will be cloned
            const templateReflection = document.getElementById('reflection');
            const templateSlide = document.getElementById('ref-slide');

            // Array to store IDs for SwiperJS navigation
            let swiperSlides = [];

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

                reflectionLocation.textContent = reflectionItem['Rep Location'];

                // Ensure the reflection is visible
                reflection.style.display = 'flex';

                // Append the cloned reflection to the reflections container
                reflectionsContainer.appendChild(reflection);

                // --- Populate the cloned #ref-slide ---
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

                // Ensure the slide is visible
                slide.style.display = 'flex';

                // Append the cloned slide to the swiper-wrapper container for SwiperJS
                slidesContainer.appendChild(slide);

                // Store slide ID for navigation
                swiperSlides.push(slide);

                // --- Add event listener to match #reflection with #ref-slide ---
                reflection.addEventListener('click', () => {
                    openPopup(index, swiper); // Open popup with the correct slide and control Swiper
                });

                // --- Apply fade-in delay using setTimeout ---
                setTimeout(() => {
                    // Add fade-in class for smooth transition with delay
                    reflection.classList.add('fade-in-visible');
                }, index * 200); // Delay by 300ms for each item
            });

            // Optionally, remove the original template reflection and slide from the DOM if not needed
            templateReflection.remove();
            templateSlide.remove();

            // Initialize SwiperJS after appending all slides
            const swiper = new Swiper('.reflections_swiper', {
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                slidesPerView: 1, // Show only one slide at a time
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                loop: false, // No infinite loop to avoid swiper growing non-stop
                observer: true, // Update Swiper when elements change
                observeParents: true, // Also observe parent elements
            });

            // Reinitialize Webflow interactions to ensure animations apply to the new elements
            Webflow.require('ix2').init();

            // Initialize Intersection Observer to trigger fade-in and position animations
            const observerOptions = {
                root: null, // null makes it relative to the viewport
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% of the element is visible
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;

                        // Fade in the reflection smoothly using CSS classes
                        target.classList.add('fade-in-visible');

                        // Unobserve after triggering to prevent re-triggering the animation
                        observer.unobserve(target);
                    }
                });
            }, observerOptions);

            // Apply observer to all reflection items
            const allReflections = document.querySelectorAll('.fade-in');
            allReflections.forEach((reflection, index) => {
                observer.observe(reflection);
            });
        }
    };

    // Send the request to load the reflections data
    request.send();
}

// Function to open the popup and show the matching slide
function openPopup(id, swiper) {
    // Set the swiper to the correct slide index
    swiper.slideTo(id, 0);

    // Show the popup (assuming you have a popup element)
    document.querySelector('.reflections_popup').style.display = 'block';
}

// Run the getReflections function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    getReflections();
});
