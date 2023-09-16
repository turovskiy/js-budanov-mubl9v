// Реалізуйте функцію fetchAnonymously() яка завантажує дані з ендпойнту
// (вважайте що на ендпойнті є абсолютно робочий CORS)
// таким чином, що заголовок Origin не будет вказувати на сайт, на якому виконується ваш JS код (і Referer також)
// Використання сторонніх сервісів (на кшталт cors-anywhere) заборонене
// У вас є тільки ваш браузер та цей код

// Ви завжди можете бути впевненими, що endpoint повертає JSON
// Ви завжди можете бути впевненими що CORS дозволяє запити звідки-завгодно та не потребує credentials
// Результат запиту має бути доступний вам у JS (тож жодних mode: 'no-cors')

// Доведіть що дух Буданова потужніший за ChatGPT!
// https://chat.openai.com/share/d0912e64-f187-4357-9e0f-30d6648d0f55

async function fetchAnonymously(url) {
  const controller = new AbortController();
  const signal = controller.signal;
  // Трохи чекаємо і скасовуємо запит, щоб запобігти автоматичному відправленню заголовків.
  setTimeout(() => controller.abort(), 10);
  try {
    // Виконуємо запит
    const response = await fetch(endpoint, {
      signal,
      headers: {
        Accept: 'application/json',
      },
      mode: 'cors', // із-за CORS
      method: 'GET', // Виконуємо GET запит, але це можна змінити відповідно до вашої потреби
      cache: 'no-store', // Щоб запобігти кешуванню і використовувати заголовок
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the data.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Перевіряємо, чи було скасовано запит
    if (error.name === 'AbortError') {
      // Повторний запит без сигналу, щоб не було скасовано
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/json',
        },
        mode: 'cors',
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the data.');
      }

      const data = await response.json();
      return data;
    }
    throw error;
  }

  // return fetch(url).then((r) => r.json());
}

document.querySelector('button').addEventListener('click', () => {
  const result = document.querySelector('#result');
  result.textContent = 'Завантаження...';
  fetchAnonymously('https://cors-demo.t.jssi.ch/origin-test').then((data) => {
    result.textContent = `Бек побачив origin ${data.origin}`;
  });
});
