const button = document.querySelector('button')

button.addEventListener('click', (getContent))

document.addEventListener("DOMContentLoaded", getFromStorage);

async function fetchImages(page, limit) {
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
    if (response.ok) {

        return await response.json()
    } else {
        const text = await response.text()
        const errorMessage = `${response.status} ${text}`
        throw new Error(errorMessage);
    }
}
async function getContent() {

    const pageInput = document.querySelector('#page')
    const limitInput = document.querySelector('#limit')

    const isNotValid = checkInput('Номер страницы и лимит', pageInput, limitInput) || checkInput('Номер страницы', pageInput) || checkInput('Лимит', limitInput)

    if (isNotValid) {
        createError(isNotValid)
        return
    }

    try {
        const data = await fetchImages(pageInput.value, limitInput.value);
        saveToStorage(data)
        await displayGallery(data)
    } catch (e) {
        createError(e.message)
    }
}

function createElement(tag, ...classList) {
    const element = document.createElement(tag);
    classList.forEach(c => element.classList.add(c));
    return element;
}

function createError(message) {
    const errorContainer = createElement('div', 'error__message')
    errorContainer.textContent = message;
    displayContent('error', errorContainer)
}

const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
};

async function displayGallery(receivedData) {

    const main = document.querySelector('main')
    let section = document.querySelector('.content')
    // если на странице уже был контент (ошибка или результат предыдущего запроса, удаляем его)
    if (section) section.remove()

    const tiles = []
    // создаем пустые плитки для картинок с учетом их размера до загрузки самих картинок
    // в плитках будет выводиться фон-прелоадер
    for (const image of receivedData) {
        const container = createElement('div', 'image-gallery__tile')
        container.style.aspectRatio = `${image.width} / ${image.height}`;
        const preloader = createElement('div', 'preloader-background')
        container.appendChild(preloader)
        tiles.push({image, container})
    }

    // загружаем картинки и помещаем их в контейнеры
    section = createElement('section', 'content', 'image-gallery')
    tiles.forEach(tile => section.appendChild(tile.container))
    main.appendChild(section)
    const imagesPromises = receivedData.map(async (image) => {
        const img = await loadImage(image.download_url);
        const tile = tiles.find(t => t.image.id === image.id);
        tile.container.style.background = `no-repeat url(${image.download_url}) 50% / cover`;
        const preloader = tile.container.querySelector('.preloader-background');
        preloader.remove();
    });
    await Promise.all(imagesPromises);
}

function displayContent(wrapperClass, ...nodeList) {
    let section = document.querySelector('.content')
    if (section) section.remove()
    section = createElement('section', 'content', wrapperClass)
    nodeList.forEach(node => section.appendChild(node))
    const main = document.querySelector('main')
    main.appendChild(section)
}

HTMLInputElement.prototype.verify = function(min, max) {
    if (!this.value) {
        return false;
    }
    const pattern = /^[0-9]+$/;
    const isNumber = pattern.test(this.value);
    const number = parseInt(this.value)
    const inLimit = number >= min && number <= max;
    isNumber && inLimit ? this.setCustomValidity("") : this.setCustomValidity("invalid")
    return isNumber && inLimit;
};

function checkInput(dataType, ...inputs) {
    const notValid = inputs.every(input => !input.verify(1, 10))
    if (notValid) {
        return`${dataType} вне диапазона от 1 до 10`;
    }
}

function saveToStorage(data) {
    localStorage.setItem('savedData', JSON.stringify(data))
}

async function getFromStorage() {
    const storedData = localStorage.getItem('savedData')
    if (storedData) {
        await displayGallery(JSON.parse(storedData))
    }
}
