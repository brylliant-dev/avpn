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
    }, index * 300); // Delay by 300ms for each item
});
