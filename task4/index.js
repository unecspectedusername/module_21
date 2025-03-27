const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const num = Math.floor(Math.random() * (100 - 1)) + 1
        if (num % 2 === 0) {
            resolve(`Завершено успешно. Сгенерированное число — ${num}`)
        } else {
            reject(`Завершено с ошибкой. Сгенерированное число — ${num}`)
        }
    }, 3000);
})

promise
    .then(console.log)
    .catch(console.log)