import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey:"" ,
    authDomain:"",
    projectId: "",
    storageBucket:"",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log('Firebase initialized successfully:', db);

let swiper = new Swiper('.swiper-container', {
    pagination: {
        el: '.swiper-pagination', 
        clickable: true,          
        type: 'bullets',         
    },
    loop: true,                   
    slidesPerView: 1,
    on: {
        slideChange: function () {
            console.log('Active real index:', this.realIndex); 
        },
    },
});



document.querySelector('.prev').addEventListener('click', () => swiper.slidePrev());
document.querySelector('.next').addEventListener('click', () => swiper.slideNext());

const textInput = document.getElementById('add-text');
const fontFamily = document.getElementById('font-family');
const fontSize = document.getElementById('font-size');
const fontColor = document.getElementById('font-color');
const addTextButton = document.getElementById('add-text');

let selectedTextElement = null; 
addTextButton.addEventListener('click', () => {
    const activeSlide = document.querySelector('.swiper-slide-active .text-overlay');
    const defaultText = "New Text"; 
    
    const textElement = document.createElement('div');
    textElement.classList.add('draggable');
    textElement.textContent = defaultText; 
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
        fontSize.value = parseInt(selectedTextElement.style.fontSize) || 14;
        fontColor.value = selectedTextElement.style.color || '#000000';

        selectedTextElement.style.border = '2px solid #007BFF'; 
    }

    document.querySelectorAll('.draggable').forEach((element) => {
        if (element !== selectedTextElement) {
            element.style.border = 'none';
        }
    });
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
            let newLeft = pageX - shiftX - container.left;
            let newTop = pageY - shiftY - container.top;

            if (newLeft < 0) newLeft = 0;
            if (newLeft > container.width - element.offsetWidth) {
                newLeft = container.width - element.offsetWidth;
            }
            if (newTop < 0) newTop = 0;
            if (newTop > container.height - element.offsetHeight) {
                newTop = container.height - element.offsetHeight;
            }

            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        };

        const onMouseMove = (event) => {
            if (isDragging) {
                moveAt(event.pageX, event.pageY);
            }
        };

        const stopDragging = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', stopDragging);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDragging);
    });

    element.ondragstart = () => false;
}

const draggables = document.querySelectorAll('.custom1');
const container = document.querySelector('.custom');

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    });
});

container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        container.appendChild(dragging);
    } else {
        container.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.custom1:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
const customDiv = document.querySelector('.custom');
const customButton = document.querySelector('.custom-button');
const saveButton = document.querySelector('.s1');
const swiperWrapper = document.querySelector('.swiper-wrapper');
document.addEventListener('DOMContentLoaded', () => {
   

    customButton.addEventListener('click', () => {
        customDiv.classList.toggle('hidden');
        if (!customDiv.classList.contains('hidden')) {
            customDiv.style.display = 'block'; 
        } else {
            customDiv.style.display = 'none'; 
        }
    });

    saveButton.addEventListener('click', () => {
        const customOrder = Array.from(customDiv.querySelectorAll('.custom1'))
            .map((custom1) => custom1.querySelector('img').src);

        const swiperSlides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));

        const reorderedSlides = customOrder.map((src) => {
            return swiperSlides.find((slide) => slide.querySelector('img').src === src);
        });

        swiperWrapper.innerHTML = '';
        reorderedSlides.forEach((slide) => {
            if (slide) swiperWrapper.appendChild(slide);
        });

        swiper.update(); 
        swiper.slideTo(0, 0); 

        customDiv.classList.add('hidden');
        customDiv.style.display = 'none'; 
    });

});


const saveButtonFirebase = document.querySelector('.custom-btn1');
saveButtonFirebase.addEventListener('click', async () => { 
    try {
        
        const selectedFontFamily = document.getElementById('font-family').value; 
        const selectedFontSize = document.getElementById('font-size').value; 
        const selectedColor = document.getElementById('font-color').value; 

        const slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide img')).map((img) => {
            const textOverlay = img.closest('.swiper-slide').querySelector('.text-overlay');

            let text = '';
            let fontFamily = selectedFontFamily || 'default';  
            let fontSize = selectedFontSize || '16px';        
            let fontColor = selectedColor || '#000000';       

            if (textOverlay) {
                textOverlay.style.fontFamily = fontFamily;
                textOverlay.style.fontSize = `${fontSize}px`;
                textOverlay.style.color = fontColor;

                text = textOverlay.textContent.trim(); 
                console.log(`Captured - Text: ${text}, FontFamily: ${fontFamily}, FontSize: ${fontSize}, FontColor: ${fontColor}`);
            } else {
                console.warn('No textOverlay found for image:', img.src);
            }

            return {
                src: img.src,       
                text: text,         
                fontFamily: fontFamily, 
                fontSize: fontSize,     
                fontColor: fontColor,   
            };
        });

        console.log('Slides to save:', slides);

        if (slides.length === 0) {
            alert('No slides found to save. Please ensure there are images in the slides.');
            return;
        }

        const dataToSave = {
            order: slides.map(slide => slide.src),  
            timestamp: new Date().toISOString(),   
            slidesData: slides,  
        };

        const docRef = await addDoc(collection(db, 'imageOrders'), dataToSave);

        console.log('Document written with ID:', docRef.id);
        alert('Data saved to Firebase successfully!');
    } catch (error) {
        console.error('Error saving data to Firebase:', error);
        alert(`Failed to save data to Firebase: ${error.message}`);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const q = query(collection(db, 'imageOrders'), orderBy('timestamp', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const lastData = querySnapshot.docs[0].data();
            const customOrder = lastData.order;  
            const slidesData = lastData.slidesData;  
            
            const swiperWrapper = document.querySelector('.swiper-wrapper'); 
            const swiperSlides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide')); 

            const reorderedSlides = customOrder.map((src) => {
                return swiperSlides.find((slide) => slide.querySelector('img').src === src);
            });

            swiperWrapper.innerHTML = ''; 
            reorderedSlides.forEach((slide, index) => {
                if (slide) {
                    const textOverlay = slide.querySelector('.text-overlay');
                    const slideData = slidesData[index]; 

                    if (textOverlay && slideData) {
                        textOverlay.textContent = slideData.text ?? '';
                        textOverlay.style.fontFamily = slideData.fontFamily ?? 'Arial'; 
                        textOverlay.style.fontSize = slideData.fontSize ?? '24px'; 
                        textOverlay.style.color = slideData.fontColor ?? '#000000'; 
                    }

                    swiperWrapper.appendChild(slide);
                }
            });

            console.log('Fetched slidesData:', slidesData);

            if (typeof swiper !== 'undefined') {
                swiper.update(); 
                swiper.slideTo(0, 0); 
            }
        } else {
            console.warn('No data found in Firebase!');
        }
    } catch (error) {
        console.error('Error fetching data from Firebase:', error);
    }
});
