// Create a variable for the API endpoint
let dataURL = new URL('https://brylliant-dev.github.io/avpn/impact-stories-data.json');

// Define a function to get impact stories information
function getStories() {
    // Create a request variable and assign a new XMLHttpRequest object to it
    let request = new XMLHttpRequest();

    // Convert the URL object to a string
    let url = dataURL.toString();

    // Open a GET request to the URL
    request.open('GET', url, true);

    // Define what happens when the request loads
    request.onload = function() {
        // Parse the JSON response into a JavaScript object
        let data = JSON.parse(this.response);

        // Check if the request was successful
        if (request.status >= 200 && request.status < 400) {
            // Sort stories by Sort_Order
            data.sort((a, b) => a.Sort_Order - b.Sort_Order);

            // Get the container where the cards will be placed
            const cardContainer1 = document.getElementById("impact-stories");
            const cardContainer2 = document.getElementById("impact-stories2");

            // Get the template card element that will be cloned
            const templateCard = document.getElementById('story');

            // Get the base class from the template card
            const baseClass = templateCard.classList[0]; // Assume the base class is the first one

            // Loop through each story item returned by the API
            data.forEach((storyItem, index) => {
                // Clone the template card
                const card = templateCard.cloneNode(true);

                // Remove the id attribute since IDs must be unique
                card.removeAttribute('id');

                // Remove all classes and reassign only the base class
                card.className = baseClass;

                // Get all IMG elements within the cloned card and set their src and srcset attributes
                const imgs = card.getElementsByTagName('IMG');
                for (let i = 0; i < imgs.length; i++) {
                    imgs[i].src = storyItem.Story_Image_URL; // Thumbnail image
                    imgs[i].srcset = storyItem.Story_Image_URL;
                }

                // Set the text content of the h3 element to the story title
                const h3 = card.getElementsByTagName('H3')[0];
                h3.textContent = storyItem.Story_Title;

                // Handle multiple paragraphs for story description
                const richTextContainer = card.getElementsByClassName('w-richtext')[0]; // Ensure the Rich Text element has this class

                // Check if the description is an array (multiple paragraphs)
                if (Array.isArray(storyItem.Story_Description)) {
                    // Build the description with <p> tags for each paragraph
                    let descriptionHTML = '';
                    storyItem.Story_Description.forEach(paragraph => {
                        descriptionHTML += `<p>${paragraph}</p>`;
                    });

                    // Inject the HTML into the Rich Text element
                    richTextContainer.innerHTML = descriptionHTML;
                } else {
                    // If it's a single string, wrap it in <p> and inject it
                    richTextContainer.innerHTML = `<p>${storyItem.Story_Description}</p>`;
                }

                // Handle the popup image inside review_impact_story_popup_image div
                const popupImageDiv = card.querySelector('.review_impact_story_popup_image');
                if (popupImageDiv) {
                    const popupImage = popupImageDiv.getElementsByTagName('IMG')[0]; // Assume the image is inside this div
                    if (popupImage) {
                        popupImage.src = storyItem.Story_Image_Popup_URL; // Set the popup image source
                        popupImage.srcset = storyItem.Story_Image_Popup_URL;
                    }
                }

                // Append the cloned card to the appropriate container
                if (index < 4) {
                    cardContainer1.appendChild(card); // First 4 stories to impact-stories
                } else if (index >= 4 && index < 8) {
                    cardContainer2.appendChild(card); // Next 4 stories to impact-stories2
                }
            });

            // Reinitialize Webflow interactions to ensure animations apply to the new elements
            // Webflow.require('ix2').init();
        }
    };

    // Send the request to the API
    request.send();
}

// Run the getStories function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    getStories();
});
