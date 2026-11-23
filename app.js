/*
 * Yandex Metrica integration point.
 * A production project should replace this placeholder with its real counter ID
 * and add the Metrica tag. Until then interactions are logged in DevTools.
 */
const METRIKA_COUNTER_ID = 99999999;

function reachGoal(goal, parameters = {}) {
  const payload = { ...parameters, scenario: 'mortgage_application' };
  if (typeof window.ym === 'function') {
    window.ym(METRIKA_COUNTER_ID, 'reachGoal', goal, payload);
  } else {
    console.info('[Metrica stub]', { counterId: METRIKA_COUNTER_ID, goal, params: payload });
  }
}

const screens = [
  {
    id: 'start',
    number: '01',
    title: 'Ипотека без лишних звонков',
    copy: 'Узнайте предварительное решение за 5 минут. Без визита в банк и бумажных справок на первом шаге.',
    event: 'mortgage_start_cta',
    eventLabel: 'Начало анкеты',
    cta: 'Рассчитать ипотеку'
  },
  {
    id: 'personal',
    number: '02',
    title: 'Расскажите о себе',
    copy: 'Эти данные нужны, чтобы банки смогли оценить заявку.',
    event: 'mortgage_personal_continue',
    eventLabel: 'Данные о заявителе',
    cta: 'Продолжить'
  },
  {
    id: 'income',
    number: '03',
    title: 'Доход и занятость',
    copy: 'Укажите средний доход после вычета налогов. Так расчёт будет точнее.',
    event: 'mortgage_income_continue',
    eventLabel: 'Данные о доходе',
    cta: 'Продолжить'
  },
  {
    id: 'property',
    number: '04',
    title: 'Какую недвижимость выбираете?',
    copy: 'Подберём программу под ваш объект.',
    event: 'mortgage_property_selected',
    eventLabel: 'Выбор объекта',
    cta: 'Показать условия'
  },
  {
    id: 'offer',
    number: '05',
    title: 'Предварительное решение',
    copy: 'Банк готов рассмотреть вашу заявку на таких условиях.',
    event: 'mortgage_application_submitted',
    eventLabel: 'Отправка заявки',
    cta: 'Отправить заявку'
  },
  {
    id: 'success',
    number: '06',
    title: 'Заявка уже в банке',
    copy: 'Проверим её и пришлём решение в SMS. Обычно это занимает до 10 минут.',
    event: 'mortgage_success_screen_viewed',
    eventLabel: 'Экран успеха',
    cta: 'Вернуться к началу'
  }
];

let currentScreen = 0;
let toastTimer;

function showToast(text) {
  const toast = document.querySelector('#toast');
  toast.textContent = text;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2400);
}

function navigate(path, { push = true } = {}) {
  if (push) window.history.pushState({}, '', path);
  render();
}

function screenProgress(index) {
  return Array.from({ length: 5 }, (_, progressIndex) => `<i class="${progressIndex <= index ? 'active' : ''}"></i>`).join('');
}

function stepHeader(index) {
  return `<div class="step-label"><span>Шаг ${Math.min(index + 1, 5)} из 5</span><div class="progress">${screenProgress(index)}</div></div>`;
}

function renderStart() {
  return `<main class="app-shell application">
    <section>
      <p class="eyebrow">Онлайн-заявка на ипотеку</p>
      <h1>Ипотека —<br>понятно с первого шага</h1>
      <p class="intro">Расскажем, на какую сумму вы можете рассчитывать, и поможем отправить заявку в банк.</p>
      <div class="benefits">
        <div class="benefit"><span class="check">✓</span> Предварительное решение за 5 минут</div>
        <div class="benefit"><span class="check">✓</span> Подходит для новостроек и вторичного жилья</div>
        <div class="benefit"><span class="check">✓</span> Никаких звонков без вашего согласия</div>
      </div>
    </section>
    <section class="card">
      <p class="eyebrow">Проверим ваши возможности</p>
      <h2 class="form-title">С чего начнём?</h2>
      <p class="form-copy">Ответьте на несколько вопросов. Предварительное решение ни к чему вас не обязывает.</p>
      <button class="button lime" data-next>Рассчитать ипотеку</button>
      <p class="hint">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
    </section>
  </main>`;
}

function renderPersonal() {
  return `<main class="app-shell application"><section><p class="eyebrow">01 / Персональные данные</p><h1>Знаем вас —<br>подберём точнее</h1><p class="intro">Данные увидит только банк, когда вы решите отправить заявку.</p></section><section class="card">${stepHeader(0)}<h2 class="form-title">Расскажите о себе</h2><p class="form-copy">Это займёт меньше минуты.</p><label class="field">Имя и фамилия<input aria-label="Имя и фамилия" value="Анна Рузич"></label><label class="field">Телефон<input aria-label="Телефон" value="+7 999 123-45-67"></label><div class="actions"><button class="button ghost" data-back>Назад</button><button class="button" data-next>Продолжить</button></div></section></main>`;
}

function renderIncome() {
  return `<main class="app-shell application"><section><p class="eyebrow">02 / Финансы</p><h1>Посчитаем<br>комфортный платёж</h1><p class="intro">Банк учитывает регулярный доход и текущие обязательства.</p></section><section class="card">${stepHeader(1)}<h2 class="form-title">Доход и занятость</h2><p class="form-copy">Укажите сумму, которая обычно приходит на карту.</p><label class="field">Ежемесячный доход после налогов<input aria-label="Ежемесячный доход" value="180 000 ₽"></label><label class="field">Место работы<input aria-label="Место работы" value="Работаю по найму"></label><div class="actions"><button class="button ghost" data-back>Назад</button><button class="button" data-next>Продолжить</button></div></section></main>`;
}

function renderProperty() {
  return `<main class="app-shell application"><section><p class="eyebrow">03 / Объект</p><h1>Дом, который<br>вам подходит</h1><p class="intro">Тип недвижимости влияет на доступные программы и ставку.</p></section><section class="card">${stepHeader(2)}<h2 class="form-title">Что планируете купить?</h2><p class="form-copy">Выберите вариант, который ближе всего к вашим планам.</p><div class="choice-grid" role="group" aria-label="Тип недвижимости"><button class="choice selected" data-choice><b>Новостройка</b><small>Квартира от застройщика</small></button><button class="choice" data-choice><b>Вторичное жильё</b><small>Готовая квартира или дом</small></button><button class="choice" data-choice><b>Дом с участком</b><small>ИЖС или готовый дом</small></button><button class="choice" data-choice><b>Рефинансирование</b><small>Уже есть ипотека</small></button></div><div class="actions"><button class="button ghost" data-back>Назад</button><button class="button" data-next>Показать условия</button></div></section></main>`;
}

function renderOffer() {
  return `<main class="app-shell application"><section><p class="eyebrow">04 / Предварительное решение</p><h1>Условия,<br>которые можно понять</h1><p class="intro">Это предварительный расчёт. Точную ставку банк подтвердит после проверки заявки.</p></section><section class="card">${stepHeader(3)}<h2 class="form-title">Вам предварительно доступно</h2><p class="form-copy">Для покупки квартиры в новостройке.</p><div class="summary"><span>Сумма кредита</span><b>до 12 400 000 ₽</b></div><div class="choice-grid"><div class="choice"><b>от 6,2%</b><small>ставка в год</small></div><div class="choice"><b>от 74 300 ₽</b><small>платёж в месяц</small></div></div><div class="actions"><button class="button ghost" data-back>Назад</button><button class="button lime" data-next>Отправить заявку</button></div><p class="hint">Дальше банк проверит кредитную историю и пришлёт окончательное решение.</p></section></main>`;
}

function renderSuccess() {
  return `<main class="app-shell application"><section><p class="eyebrow">Готово</p><h1>Первый шаг<br>уже сделан</h1><p class="intro">Теперь можно спокойно заняться поиском квартиры — мы сообщим о решении в SMS.</p></section><section class="card"><div class="success-icon">✓</div><h2 class="form-title">Заявка принята</h2><p class="form-copy">Номер заявки: <b>ML-2408</b>. Обычно проверка занимает до 10 минут.</p><div class="summary"><span>Что дальше</span><b>Пришлём решение на телефон</b></div><button class="button" data-restart>Вернуться к началу</button></section></main>`;
}

function renderApplication() {
  const templates = [renderStart, renderPersonal, renderIncome, renderProperty, renderOffer, renderSuccess];
  document.querySelector('#app').innerHTML = templates[currentScreen]();
  document.title = `${screens[currentScreen].title} — Дом.Лайт`;
  setActiveNav('/');
  reachGoal('mortgage_screen_viewed', { step: screens[currentScreen].id, step_number: currentScreen + 1 });
  bindApplicationEvents();
}

function miniScreen(index) {
  const screen = screens[index];
  let interior;
  if (index === 3) interior = '<div class="mini-eyebrow">шаг 3</div><div class="mini-title">Какую недвижимость выбираете?</div><div class="mini-choices"><i class="mini-choice"></i><i class="mini-choice"></i><i class="mini-choice"></i><i class="mini-choice"></i></div><div class="mini-button"></div>';
  else if (index === 4) interior = '<div class="mini-eyebrow">шаг 4</div><div class="mini-title">Предварительное решение</div><div class="mini-copy"></div><div class="mini-field"></div><div class="mini-button lime"></div>';
  else if (index === 5) interior = '<div class="mini-success">✓</div><div class="mini-title">Заявка принята</div><div class="mini-copy"></div><div class="mini-copy short"></div>';
  else interior = `<div class="mini-eyebrow">${index === 0 ? 'онлайн-заявка' : `шаг ${index}`}</div><div class="mini-title">${screen.title}</div><div class="mini-copy"></div><div class="mini-copy short"></div>${index > 0 ? '<div class="mini-field"></div>' : ''}<div class="mini-button ${index === 0 ? 'lime' : ''}"></div>`;
  return `<button class="map-node node-${index}" data-map-screen="${index}" aria-label="Открыть экран: ${screen.title}"><div class="mini-top"><span class="mini-brand">дом·лайт</span><span>${index + 1}/6</span></div><div class="mini-body">${interior}</div><span class="node-label">${screen.number} · ${screen.id}<small>${screen.event}</small></span></button>`;
}

function eventTag(x, y, width, event, step) {
  return `<g transform="translate(${x} ${y})"><rect class="event-label-bg" x="0" y="0" rx="3" width="${width}" height="30"></rect><text x="8" y="12">${event}</text><text x="8" y="23" fill="#77796f" font-size="9" font-weight="500">step: ${step}</text></g>`;
}

function mapConnections() {
  return `<svg class="connection-layer" viewBox="0 0 1245 510" aria-hidden="true"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#73756a" /></marker></defs><path d="M166 240 C190 240 190 173 214 173"/><path d="M380 173 C406 173 406 240 430 240"/><path d="M596 240 C620 240 620 173 646 173"/><path d="M812 173 C836 173 836 240 862 240"/><path d="M1028 240 C1052 240 1052 173 1078 173"/>${eventTag(150, 277, 138, 'mortgage_start_cta', 'personal')}${eventTag(361, 277, 164, 'mortgage_personal_continue', 'income')}${eventTag(574, 277, 161, 'mortgage_income_continue', 'property')}${eventTag(787, 277, 164, 'mortgage_property_selected', 'offer')}${eventTag(1000, 277, 176, 'mortgage_application_submitted', 'success')}</svg>`;
}

function renderMap() {
  document.querySelector('#app').innerHTML = `<main class="map-page"><section class="map-hero"><div><p class="eyebrow">Отдельная страница · /map</p><h1>Карта сценария ипотеки</h1><p>Шесть экранов от первого касания до отправки заявки. Нажмите миниатюру, чтобы открыть соответствующий экран прототипа.</p></div><div class="map-key"><span><i class="key-dot screen"></i>экран</span><span><i class="key-dot event"></i>цель Метрики</span></div></section><section class="map-canvas" aria-label="Карта пользовательского сценария"><div class="flow">${mapConnections()}${screens.map((_, index) => miniScreen(index)).join('')}</div></section><p class="map-caption">Подписи на карточках — экран и его основное событие. Подписи на стрелках — цель, отправляемая при переходе, и параметр <code>step</code>.</p><section class="experiments" aria-labelledby="ab-title"><div><p class="eyebrow">План эксперимента</p><h2 id="ab-title">Проверим, помогает ли ранняя выгода начать заявку</h2><p>Вариант выбирается при первом визите и сохраняется до завершения воронки. Деление трафика — 50 / 50.</p><span class="chip">A: текущий сценарий</span><span class="chip">B: ранний расчёт</span></div><div class="test-card"><dl class="test-grid"><div class="test-row full"><dt>Гипотеза</dt><dd>Если на первом экране показать ориентировочный ежемесячный платёж до запроса персональных данных, больше посетителей начнут и завершат заявку.</dd></div><div class="test-row"><dt>Что меняем в B</dt><dd>Вместо общего оффера добавляем простой блок расчёта: стоимость жилья, первоначальный взнос и сразу видимый платёж «от … ₽/мес». CTA меняем на «Получить точные условия».</dd></div><div class="test-row"><dt>Основная метрика</dt><dd class="metric">Конверсия из просмотра первого экрана в <code>mortgage_application_submitted</code>.</dd></div><div class="test-row"><dt>Ограничивающая метрика</dt><dd>Доля заявок, прошедших первичный скоринг. Она не должна снизиться более чем на 2 п.п., иначе рост будет некачественным.</dd></div><div class="test-row"><dt>Размер выборки</dt><dd>По 4 500 уникальных пользователей на вариант (9 000 всего): достаточно, чтобы заметить рост завершения с 8% до 10% при 95% доверии и 80% мощности.</dd></div><div class="test-row"><dt>Длительность</dt><dd>Минимум 2 полные недели; при среднем трафике 650 входов в день — около 14 дней. Не останавливать раньше набора выборки.</dd></div></dl><div class="test-note">Сегментировать результат по устройству и источнику трафика. Решение принимать только после проверки основной и ограничивающей метрик.</div></div></section></main>`;
  document.title = 'Карта сценария ипотеки — Дом.Лайт';
  setActiveNav('/map');
  reachGoal('mortgage_map_viewed', { step: 'map' });
  document.querySelectorAll('[data-map-screen]').forEach((node) => node.addEventListener('click', () => {
    currentScreen = Number(node.dataset.mapScreen);
    reachGoal('mortgage_map_screen_opened', { step: screens[currentScreen].id, step_number: currentScreen + 1 });
    navigate('/');
  }));
}

function setActiveNav(path) {
  document.querySelectorAll('[data-nav]').forEach((link) => link.classList.toggle('active', link.getAttribute('href') === path));
}

function bindApplicationEvents() {
  document.querySelector('[data-next]')?.addEventListener('click', () => {
    const source = screens[currentScreen];
    reachGoal(source.event, { step: screens[Math.min(currentScreen + 1, screens.length - 1)].id, step_number: currentScreen + 2 });
    currentScreen = Math.min(currentScreen + 1, screens.length - 1);
    renderApplication();
  });
  document.querySelector('[data-back]')?.addEventListener('click', () => {
    reachGoal('mortgage_step_back', { step: screens[currentScreen].id, step_number: currentScreen + 1 });
    currentScreen = Math.max(0, currentScreen - 1);
    renderApplication();
  });
  document.querySelector('[data-restart]')?.addEventListener('click', () => {
    reachGoal('mortgage_restart', { step: 'success' });
    currentScreen = 0;
    renderApplication();
  });
  document.querySelectorAll('[data-choice]').forEach((choice) => choice.addEventListener('click', () => {
    document.querySelectorAll('[data-choice]').forEach((other) => other.classList.remove('selected'));
    choice.classList.add('selected');
    reachGoal('mortgage_property_option_selected', { step: 'property', property_type: choice.textContent.trim().split('\n')[0] });
  }));
}

function render() {
  if (window.location.pathname === '/map') renderMap();
  else renderApplication();
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-nav]');
  if (!link) return;
  event.preventDefault();
  navigate(link.getAttribute('href'));
});
window.addEventListener('popstate', render);
render();
