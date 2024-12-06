const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

document.querySelector('.prev').addEventListener('click', () => swiper.slidePrev());
document.querySelector('.next').addEventListener('click', () => swiper.slideNext());

const textInput = document.getElementById('text-input');
const fontFamily = document.getElementById('font-family');
const fontSize = document.getElementById('font-size');
const fontColor = document.getElementById('font-color');
const addTextButton = document.getElementById('add-text');

let selectedTextElement = null; 
addTextButton.addEventListener('click', () => {
    const activeSlide = document.querySelector('.swiper-slide-active .text-overlay');
    const textValue = textInput.value.trim();

    if (!textValue) {
        alert('Please enter some text!');
        return;
    }

    const textElement = document.createElement('div');
    textElement.classList.add('draggable');
    textElement.textContent = textValue;
    textElement.contentEditable = true;
    textElement.style.fontFamily = fontFamily.value;
    textElement.style.fontSize = `${fontSize.value}px`;
    textElement.style.color = fontColor.value;

    makeDraggable(textElement);
    textElement.addEventListener('click', () => {
        selectedTextElement = textElement;
        updateControls(); 
    });

    activeSlide.appendChild(textElement);
    textInput.value = '';
});

fontFamily.addEventListener('change', () => {
    if (selectedTextElement) {
        selectedTextElement.style.fontFamily = fontFamily.value;
    }
});

fontSize.addEventListener('input', () => {
    if (selectedTextElement) {
        selectedTextElement.style.fontSize = `${fontSize.value}px`;
    }
});

fontColor.addEventListener('input', () => {
    if (selectedTextElement) {
        selectedTextElement.style.color = fontColor.value;
    }
});

function updateControls() {
    if (selectedTextElement) {
        fontFamily.value = selectedTextElement.style.fontFamily || 'Arial';
        fontSize.value = parseInt(selectedTextElement.style.fontSize) || 20;
        fontColor.value = selectedTextElement.style.color || '#000000';
    }
}

function makeDraggable(element) {
    element.style.position = 'absolute';

    let isDragging = false;

    element.addEventListener('mousedown', (event) => {
        isDragging = true;

        const shiftX = event.clientX - element.getBoundingClientRect().left;
        const shiftY = event.clientY - element.getBoundingClientRect().top;

        const container = element.parentElement.getBoundingClientRect();

        const moveAt = (pageX, pageY) => {
            let newLeft = pageX - shiftX;
            let newTop = pageY - shiftY;

            const rightBoundary = container.right - element.offsetWidth;
            const bottomBoundary = container.bottom - element.offsetHeight;

            if (newLeft < container.left) newLeft = container.left;
            if (newLeft > rightBoundary) newLeft = rightBoundary;
            if (newTop < container.top) newTop = container.top;
            if (newTop > bottomBoundary) newTop = bottomBoundary;

            element.style.left = `${newLeft - container.left}px`;
            element.style.top = `${newTop - container.top}px`;
        };

        const onMouseMove = (event) => {
            if (isDragging) {
                moveAt(event.pageX, event.pageY);
            }
        };

        document.addEventListener('mousemove', onMouseMove);

        const stopDragging = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mousedown', outsideClick);
        };

        const outsideClick = (event) => {
            if (!element.contains(event.target)) {
                stopDragging();
            }
        };

        document.addEventListener('mousedown', outsideClick);
        document.addEventListener('mouseup', stopDragging);
    });

    element.ondragstart = () => false;
}
