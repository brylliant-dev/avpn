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

            // Loop through each testimonial item
            data.forEach((testimonialItem, index) => {
                // Clone the template testimonial
                const testimonial = templateTestimonial.cloneNode(true);

                // Remove the id attribute since IDs must be unique
                testimonial.removeAttribute('id');

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
                let shadeColor = interpolateColor('#F6A370', '#CF672E', index / (data.length - 1));
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

// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
    // Parse the hex colors
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    // Interpolate between the two colors
    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));

    // Return the new color as an rgb string
    return `rgb(${r}, ${g}, ${b})`;
}

// Function to convert hex to RGB
function hexToRgb(hex) {
    // Convert shorthand hex (#abc) to full form (#aabbcc)
    if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}
