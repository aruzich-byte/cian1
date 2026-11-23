const state = {
  screen: 0,
  name: 'Иванов Иван Иванович',
  email: 'ivanov@email.ru',
  income: '',
  property: 'Новостройка',
  callback: 'Завтра, 12:00–14:00'
};

const screens = [
  { id: 'welcome', title: 'Старт', event: 'mortgage_started' },
  { id: 'contacts', title: 'Контакты', event: 'mortgage_contacts_completed' },
  { id: 'income', title: 'Доход', event: 'mortgage_income_completed' },
  { id: 'property', title: 'Объект', event: 'mortgage_property_selected' },
  { id: 'callback', title: 'Звонок', event: 'mortgage_callback_selected' },
  { id: 'success', title: 'Готово', event: 'mortgage_submitted' }
];

const app = document.querySelector('#app');
const isMap = /\/map\/?(index\.html)?$/.test(window.location.pathname);

function esc(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function icon(name) {
  const icons = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7M8 12h11"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.48A7.5 7.5 0 1 1 19.3 10L21 7.5l-.15 3.72c.1.1.1.18.15.28Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.2 5.2 0 0 0-7.35 0L12 6.25l-1.45-1.46A5.2 5.2 0 0 0 3.2 12.15L12 21l8.8-8.85a5.2 5.2 0 0 0 0-7.35Z"/></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5"/><path d="M4.5 20c.8-3.55 3.4-5.3 7.5-5.3s6.7 1.75 7.5 5.3"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.2 4.2L19.5 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'
  };
  return icons[name] || '';
}

function topbar({ back = false, close = false } = {}) {
  return `<header class="topbar">
    <button class="top-action ${back ? '' : 'hidden'}" data-action="back" aria-label="Назад">${icon('back')}</button>
    <button class="top-action ${back ? 'hidden' : ''}" data-action="toggle-menu" aria-label="Открыть меню">${icon('menu')}</button>
    <a class="brand" href="/" aria-label="Циан">${brandMark()}<span>Циан</span></a>
    <div class="top-icons"><button aria-label="Сообщения">${icon('chat')}<i></i></button><button aria-label="Избранное">${icon('heart')}</button><button aria-label="Профиль">${icon('profile')}<i></i></button></div>
    ${close ? `<button class="top-action close" data-action="restart" aria-label="Закрыть">${icon('close')}</button>` : ''}
    ${state.menu ? `<div class="quick-nav"><a href="/map">Карта сценария <span>→</span></a></div>` : ''}
  </header>`;
}

function brandMark() { return '<b class="brand-mark"><i></i><i></i></b>'; }

function footer(label, action = 'next') {
  return `<footer class="form-footer"><button class="primary" data-action="${action}">${label}</button></footer>`;
}

function progress() {
  const current = Math.min(state.screen, 4);
  return `<div class="form-progress"><span>Шаг ${current} из 4</span><div><b style="width:${current * 25}%"></b></div><button data-action="restart" aria-label="Закрыть">${icon('close')}</button></div>`;
}

function layout(content, button, options = {}) {
  return `<div class="phone-page">${topbar(options)}${options.progress ? progress() : ''}<section class="form-content">${content}</section>${button || ''}</div>`;
}

function welcome() {
  return `<div class="phone-page welcome">${topbar()}
    <div class="hero-art" aria-hidden="true"><div class="calculator"><b>+ 123</b><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="coin">₽</div><div class="shape"></div></div>
    <section class="welcome-sheet"><h1>Узнайте шансы<br>на одобрение ипотеки</h1>
    <ul class="benefit-list"><li><span>◌</span>Простые вопросы</li><li><span>${icon('check')}</span>Не передаём данные<br>без вашего согласия</li><li><span>⌑</span>Документы не нужны</li><li><span>⌕</span>Можно сохранить<br>и продолжить позже</li></ul>
    <button class="primary" data-action="next">Начать</button><p class="legal">Нажимая «Начать», я принимаю <a href="#">условия оферты</a>.<br><a href="#">Правила обработки персональных данных</a>.</p></section></div>`;
}

function contacts() {
  return layout(`${progress()}<h1>Как к вам обращаться?</h1><p class="lead">Проверим контакты, чтобы ипотечный эксперт мог связаться с вами.</p>
    <label class="field"><span>ФИО</span><input id="name" autocomplete="name" value="${esc(state.name)}"></label>
    <label class="field"><span>Телефон</span><input value="+7 999 999-99-99" readonly class="readonly"><small>Номер указан в профиле и изменить его нельзя</small></label>
    <label class="field"><span>Почта</span><input id="email" type="email" autocomplete="email" value="${esc(state.email)}"></label>`, footer('Далее'), { back: true });
}

function income() {
  const values = ['80 000 ₽', '120 000 ₽', '180 000 ₽', 'Больше 250 000 ₽'];
  return layout(`${progress()}<h1>Ваш доход</h1><p class="lead">Укажите чистый доход в месяц. Банк может запросить подтверждение.</p>
    <label class="field currency"><input id="income" inputmode="numeric" placeholder="100 000" value="${esc(state.income)}"><b>₽</b></label>
    <div class="quick-values">${values.map((item) => `<button class="quick ${state.income === item ? 'selected' : ''}" data-income="${item}">${item}</button>`).join('')}</div>
    <p class="info-copy">Можно приблизительно — это не банковская анкета.</p>`, footer('Далее'), { back: true });
}

function property() {
  const values = [['Новостройка', 'Квартира от застройщика'], ['Вторичное жильё', 'Готовая квартира или дом'], ['Дом с участком', 'ИЖС или готовый дом'], ['Рефинансирование', 'Уже есть ипотека']];
  return layout(`${progress()}<h1>Какую недвижимость выбираете?</h1><p class="lead">Тип объекта поможет подобрать программу и ставку.</p><div class="option-grid">${values.map(([name, hint]) => `<button class="option ${state.property === name ? 'selected' : ''}" data-property="${name}"><b>${name}</b><span>${hint}</span>${state.property === name ? `<i>${icon('check')}</i>` : ''}</button>`).join('')}</div>`, footer('Показать условия'), { back: true });
}

function callback() {
  const slots = ['Сегодня, 18:00–20:00', 'Завтра, 10:00–12:00', 'Завтра, 12:00–14:00', 'Ср, 15:00–17:00'];
  return layout(`${progress()}<h1>Когда удобно созвониться?</h1><p class="lead">Эксперт позвонит в один из ближайших трёх дней.</p><div class="time-list">${slots.map((slot) => `<button class="time ${state.callback === slot ? 'selected' : ''}" data-callback="${slot}">${slot}${state.callback === slot ? icon('check') : ''}</button>`).join('')}</div><p class="notice">Нажимая «Отправить заявку», вы соглашаетесь на обработку персональных данных.</p>`, footer('Отправить заявку', 'submit'), { back: true });
}

function success() {
  return layout(`<div class="success"><div class="success-check">${icon('check')}</div><h1>Свяжемся завтра,<br>с 12:00 до 14:00</h1><p class="lead">Партнёр Циана позвонит<br>на +7 999 999-99-99</p><div class="success-offer"><h2>От 48 262 ₽/мес</h2><p>Новостройка · Базовая</p><div><span>Стоимость<b>8 900 000 ₽</b></span><span>Первый взнос<b>3 000 000 ₽</b></span><span>Ставка<b>От 6%</b></span><span>Срок<b>30 лет</b></span></div></div><div class="profile-card"><b>Иванов Иван Иванович</b><span>+7 999 999-99-99<br>ivanov@email.ru</span></div></div>`, '', { close: true });
}

function renderForm() {
  const views = [welcome, contacts, income, property, callback, success];
  app.innerHTML = views[state.screen]();
  document.title = `${screens[state.screen].title} — Циан`;
  bindForm();
}

function mapHeader() {
  return `<header class="map-top"><a href="/" class="brand">${brandMark()}<span>Циан</span></a><nav><a href="/">Анкета</a><a class="active" href="/map">Карта сценария</a></nav><a href="/" class="map-open">Открыть прототип</a></header>`;
}

function mini(index) {
  const screen = screens[index];
  const content = [
    '<div class="mini-art"></div><h4>Узнайте шансы<br>на ипотеку</h4><span class="mini-button">Начать</span>',
    '<div class="mini-progress"><b></b></div><h4>Как к вам<br>обращаться?</h4><i></i><i></i><span class="mini-button">Далее</span>',
    '<div class="mini-progress"><b class="two"></b></div><h4>Ваш доход</h4><i></i><em></em><span class="mini-button">Далее</span>',
    '<div class="mini-progress"><b class="three"></b></div><h4>Какую недвижимость?</h4><div class="mini-options"></div><span class="mini-button">Показать условия</span>',
    '<div class="mini-progress"><b class="four"></b></div><h4>Когда созвониться?</h4><i></i><i></i><span class="mini-button">Отправить</span>',
    '<div class="mini-success">✓</div><h4>Свяжемся завтра</h4><p>с 12:00 до 14:00</p>'
  ][index];
  return `<button class="map-node node-${index}" data-open="${index}"><div class="mini-phone"><div class="mini-bar">9:41 <span>⌁ ▰</span></div><div class="mini-logo">◆ Циан</div>${content}</div><span><b>${String(index + 1).padStart(2, '0')} · ${screen.title}</b><small>${screen.event}</small></span></button>`;
}

function map() {
  app.innerHTML = `${mapHeader()}<main class="map-page"><section class="map-intro"><p class="eyebrow">Карта сценария</p><h1>Короткая анкета<br>на ипотеку</h1><p>Новый интерфейс повторяет паттерны мобильного Циана: знакомая шапка, синий CTA, ясный прогресс и результат с условиями кредита.</p></section><section class="flow-wrap"><div class="flow">${screens.map((_, index) => mini(index)).join('')}<svg class="flow-lines" viewBox="0 0 1130 360" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7z" fill="#91a2c5"/></marker></defs><path d="M135 183 H205"/><path d="M320 183 H390"/><path d="M505 183 H575"/><path d="M690 183 H760"/><path d="M875 183 H945"/></svg></div></section><section class="map-notes"><article><span>Вход</span><b>Обещание пользы</b><p>Четыре причины начать вместо длинной банковской анкеты.</p></article><article><span>Форма</span><b>Один вопрос за раз</b><p>Снижаем когнитивную нагрузку и показываем прогресс.</p></article><article><span>Результат</span><b>Следующий шаг понятен</b><p>Пользователь видит время звонка и предварительные условия.</p></article></section></main>`;
  document.title = 'Карта сценария — Циан';
  document.querySelectorAll('[data-open]').forEach((node) => node.addEventListener('click', () => { state.screen = Number(node.dataset.open); window.location.href = '/'; }));
}

function bindForm() {
  document.querySelectorAll('[data-income]').forEach((button) => button.addEventListener('click', () => { state.income = button.dataset.income; renderForm(); }));
  document.querySelectorAll('[data-property]').forEach((button) => button.addEventListener('click', () => { state.property = button.dataset.property; renderForm(); }));
  document.querySelectorAll('[data-callback]').forEach((button) => button.addEventListener('click', () => { state.callback = button.dataset.callback; renderForm(); }));
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'toggle-menu') { state.menu = !state.menu; renderForm(); return; }
    if (action === 'back') state.screen = Math.max(0, state.screen - 1);
    else if (action === 'restart') state.screen = 0;
    else if (action === 'submit') state.screen = 5;
    else state.screen = Math.min(5, state.screen + 1);
    renderForm();
  }));
  document.querySelector('#name')?.addEventListener('input', (event) => { state.name = event.target.value; });
  document.querySelector('#email')?.addEventListener('input', (event) => { state.email = event.target.value; });
  document.querySelector('#income')?.addEventListener('input', (event) => { state.income = event.target.value; });
}

isMap ? map() : renderForm();
