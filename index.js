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

window.addEventListener(
  'message',
  function (event) {
    const data = event.data;
    if (event.data.origin != undefined) {
      document.querySelector(
        '#result'
      ).textContent = `Бек побачив origin ${event.data.origin}`;
    }
    console.log('Дані отримані від iframe:', event.data);
  },
  false
);

function fetchAnonymouslyOld(url) {
  console.log('fetchAnonymouslyOld start');
  return fetch(url).then((r) => r.json());
}

function fetchAnonymouslyNew() {
  // Створення iframe
  // Створення заголовка H1
  const h1 = document.createElement('h1');
  h1.textContent = 'Html page';
  document.body.appendChild(h1);

  // Створення заголовка H2 з ID "result"
  const h2Result = document.createElement('h2');
  h2Result.id = 'result';
  document.body.appendChild(h2Result);

  // Створення кнопки "Відправити Old version"
  const btnOld = document.createElement('button');
  btnOld.id = 'old';
  btnOld.textContent = 'Відправити Old version';
  btnOld.addEventListener('click', () => {
    const result = document.querySelector('#result');
    result.textContent = 'Завантаження...';
    fetchAnonymouslyOld('https://cors-demo.t.jssi.ch/origin-test').then(
      (data) => {
        result.textContent = `Бек побачив origin ${data.origin}`;
      }
    );
  });
  document.body.appendChild(btnOld);

  // Створення заголовка H2 з ID "result-new"
  const h2ResultNew = document.createElement('h2');
  h2ResultNew.id = 'result-new';

  document.body.appendChild(h2ResultNew);

  // Створення кнопки "Відправити New version"
  const btnNew = document.createElement('button');
  btnNew.id = 'new';
  btnNew.textContent = 'Відправити New version';
  btnNew.addEventListener('click', ff);
  document.body.appendChild(btnNew);
  console.log('DOMContentLoaded');

  function ff() {
    const result = document.querySelector('#result');

    result.textContent = 'Завантаження...';

    const iframe = document.createElement('iframe');
    iframe.name = 'malicious';
    iframe.width = '0px';
    iframe.height = '0px';
    iframe.style.border = '0px none';
    iframe.sandbox = 'allow-scripts';
    iframe.srcdoc = `
              <script>
                       console.log('iframe');
                      var r = new XMLHttpRequest();
                      var url = 'https://cors-demo.t.jssi.ch/origin-test';
                      r.open('GET',url, false);
                      r.withCredentials = false;
                      r.send();
                      const obj = JSON.parse(r.responseText);
                      window.parent.postMessage(obj, "https://js-budanov-mubl9v.stackblitz.io"); 
              </script>
            `;
    document.body.appendChild(iframe);
  }
}

fetchAnonymouslyNew();

