// Create a variable for the JSON file URL
let testimonialsUrl = new URL('https://brylliant-dev.github.io/avpn/hear-from-members.json');

// Define a function to get testimonials data
function getTestimonials() {
    // Create a request variable and assign a new XMLHttpRequest object to it
    let request = new XMLHttpRequest();

    // Convert the URL object to a string
    let url = testimonialsUrl.toString();

    // Open a GET request to the URL
    request.open('GET', url, true);

    // Define what happens when the request loads
    request.onload = function() {
        // Parse the JSON response into a JavaScript object
        let data = JSON.parse(this.response);

        // Check if the request was successful
        if (request.status >= 200 && request.status < 400) {
            // Sort testimonials by ID
            data.sort((a, b) => a.ID - b.ID);

            // Get the container where the testimonials will be placed
            const testimonialsContainer = document.getElementById("testimonials-container");

            // Get the template testimonial element that will be cloned
            const templateTestimonial = document.getElementById('testimonial');

            // Get the base class from the template testimonial
            const baseClass = templateTestimonial.classList[0]; // Assume the base class is the first one

            // Loop through each testimonial item
            data.forEach((testimonialItem, index) => {
                // Clone the template testimonial
                const testimonial = templateTestimonial.cloneNode(true);

                // Remove the id attribute since IDs must be unique
                testimonial.removeAttribute('id');

                // Remove all classes and reassign only the base class
                //testimonial.className = baseClass;

                // Fill in the member name, designation, quote, and image (if available)
                testimonial.querySelector('.member-name').textContent = testimonialItem['Member Name'];
                testimonial.querySelector('.member-designation').textContent = testimonialItem['Member Designation'];
                testimonial.querySelector('.member-quote').textContent = testimonialItem['Member Quote'];

                // Assuming there's a member image, set the src if the field exists
                const img = testimonial.querySelector('.member-image');
                if (testimonialItem['Member Image']) {
                    img.src = testimonialItem['Member Image'];
                } else {
                    img.remove(); // Optionally remove the image element if not available
                }

                // Apply a unique shade based on the index
                let shadeColor = getShadeOfColor('#F6A370', index, data.length);
                testimonial.style.backgroundColor = shadeColor;

                // Append the cloned testimonial to the container
                testimonialsContainer.appendChild(testimonial);
            });

            // Optionally, remove the original template testimonial from the DOM if not needed
            templateTestimonial.remove();

            // Reinitialize Webflow interactions to ensure animations apply to the new elements
            Webflow.require('ix2').init();
        }
    };

    // Send the request to load the testimonials data
    request.send();
}

// Run the getTestimonials function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    getTestimonials();
});

// Function to generate shades of a color
function getShadeOfColor(color, index, total) {
    // Convert hex to RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    // Calculate the shading factor
    let factor = index / total * 0.5; // Adjust the factor for shading (0.5 for darker shades)

    // Apply the shading factor to the RGB values
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));

    // Convert back to hex and return the shaded color
    return `rgb(${r}, ${g}, ${b})`;
}
