// JavaScript to handle sliding functionality

let currentSlide = 0;
const cardSlider = document.querySelectorAll(".card-slider");

function slideCards(direction) {
    const sliderWrapper = cardSlider[currentSlide].querySelector(".slider-wrapper");
    const cards = cardSlider[currentSlide].querySelectorAll(".card");
    const cardWidth = cards[0].offsetWidth;
    const sliderWidth = sliderWrapper.offsetWidth;
    const slideDistance = cardWidth + 20; // Adjust 20px to include margin-right

    const maxSlides = cards.length - Math.floor(sliderWidth / cardWidth);

    if (direction === -1 && currentSlide > 0) {
        currentSlide--;
    } else if (direction === 1 && currentSlide < maxSlides) {
        currentSlide++;
    }

    const translateX = -currentSlide * slideDistance;
    sliderWrapper.style.transform = `translateX(${translateX}px)`;

    // Disable/enable navigation buttons based on the current slide
    const prevBtn = cardSlider[currentSlide].querySelector(".prev-btn");
    const nextBtn = cardSlider[currentSlide].querySelector(".next-btn");

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === maxSlides;
}

// Initialize slider
window.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.querySelectorAll(".prev-btn");
    const nextBtn = document.querySelectorAll(".next-btn");

    for (let i = 0; i < prevBtn.length; i++) {
        prevBtn[i].addEventListener("click", () => slideCards(-1));
        nextBtn[i].addEventListener("click", () => slideCards(1));
    }
});
