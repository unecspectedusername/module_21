const button = document.querySelector('button')

button.addEventListener('click', getContent)

const preloader = () => {
    return createElement('div', 'preloader');
}

async function getContent() {
    const userId = document.querySelector('input').value
    if (!userId) {
        const error = createError('Вы не ввели ID пользователя')
        showContent(error)
        return
    }
    let tasks;
    try {
        tasks = await getTasks(userId)
    } catch (e) {
        tasks = createError(e.toString())
    }
    if (Array.isArray(tasks)) {
        const list = createTaskList(tasks)
        showContent(list)
    } else {
        const error = createError(tasks)
        showContent(error)
    }

}

async function getTasks(userId) {
    try {
        showContent(preloader())
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);
        const data = await response.json()
        if (data.length > 0) {
            return data
        } else {
            return 'Пользователь с таким ID не найден';
        }
    } catch (e) {
        return e;
    }
}

function createElement(tag, ...classNames) {
    const element = document.createElement(tag);
    if (classNames) {
        classNames.forEach(c => element.classList.add(c))
    }
    return element;
}

function createTaskList(tasks) {
    const list = createElement('ul', 'content__list');
    for (const task of tasks) {
        const listElement = createElement('li', 'content__list-element');
        const label = createElement('label', 'content__checkbox-label')
        const input = createElement('input', 'content__checkbox');
        input.type = 'checkbox';
        const text = createElement('span', 'content__text');
        text.textContent = task.title;
        input.addEventListener('change', () => {
            text.classList.toggle('content__text--completed')
        });
        [input, text].forEach(n => label.appendChild(n));
        listElement.appendChild(label)
        if (task.completed) {
            input.checked = true;
            text.classList.add('content__text--completed')
        }
        list.appendChild(listElement)
    }
    return list
}

function showContent(content) {
    let section = document.querySelector('.content')
    if (section) {
        section.remove()
    }
    section = createElement('section', 'content')
    section.appendChild(content)
    const main = document.querySelector('main')
    main.appendChild(section)
}

function createError(message) {
    const error = createElement('div', 'error')
    error.textContent = message;
    return error;
}