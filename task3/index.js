const getDate = () => {
    const date = new Date();
    const timeProps = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
    };
    return date.toLocaleString('ru', timeProps)
}

function greet() {
    if (!localStorage.getItem('lastVisit') && !localStorage.getItem('userName')) {
        let userName;
        while (!userName) {
            userName = prompt('Добро пожаловать! Назовите, пожалуйста, ваше имя');
        }
        localStorage.setItem('userName', userName);
        localStorage.setItem('lastVisit', getDate());
    } else {
        const day = localStorage.getItem('lastVisit').split(' ')[0];
        isTuesday = day === 'вторник';
        alert(`Добрый день, ${localStorage.getItem('userName')}! Давно не виделись. В последний раз вы были у нас ${isTuesday ? 'во' : 'в'} ${localStorage.getItem('lastVisit')}`)
        localStorage.setItem('lastVisit', getDate())
    }
}

window.addEventListener("load", greet);