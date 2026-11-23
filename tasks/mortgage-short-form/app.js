const state = {
  step: -1,
  name: "",
  email: "anna.ruzich@example.com",
  purchase: "",
  object: "",
  needHelp: "",
  income: "",
  hasLoans: "",
  loanPayment: "",
  callback: "",
  marketing: false
};

const steps = ["Контакты", "Планы", "Финансы", "Звонок"];
const app = document.querySelector("#app");

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;","\"":"&quot;"})[char]);
}

function header() {
  const isIntro = state.step === -1;
  const isSuccess = state.step === 4;
  if (isIntro || isSuccess) return `<div class="topbar"><span class="brand">циан<i>•</i></span></div>`;
  const current = state.step + 1;
  return `
    <div class="topbar">
      <button class="back" type="button" data-action="back" aria-label="Назад">‹</button>
      <span class="brand">циан<i>•</i></span>
    </div>
    <div class="progress-wrap">
      <div class="progress-label"><span>${steps[state.step]}</span><span>${current} из ${steps.length}</span></div>
      <div class="progress-track"><div class="progress-value" style="width:${current / steps.length * 100}%"></div></div>
    </div>`;
}

function layout(content, footer = "") {
  return `<div class="screen">${header()}<div class="content">${content}</div>${footer ? `<div class="footer">${footer}</div>` : ""}</div>`;
}

function choice(label, value, selected, group) {
  return `<button type="button" class="choice ${selected === value ? "selected" : ""}" data-choice="${group}" data-value="${escapeHtml(value)}">${label}</button>`;
}

function renderIntro() {
  return layout(`
    <div class="entry-hero">
      <div><h1>Поможем с ипотекой без длинной анкеты</h1><p class="lead">Ответьте на несколько вопросов — эксперт подберёт решение и позвонит в удобное время.</p></div>
      <div class="object-card"><span>Подходящий вариант</span><b>Семейная ипотека</b><small>Новостройка · ставка от 6%</small></div>
      <div class="benefit"><div class="benefit-icon">✓</div><div><strong>Без документов и выбора банка</strong><p>Сейчас нужны только основные данные. Всё остальное эксперт уточнит в разговоре.</p></div></div>
    </div>
  `, `<button class="primary" type="button" data-action="start">Продолжить</button>`);
}

function renderContacts() {
  return layout(`
    <h1>Как к вам обращаться?</h1><p class="lead">Проверим контакты, чтобы эксперт мог связаться с вами.</p>
    <div class="field" id="name-field"><label for="name">ФИО</label><input id="name" autocomplete="name" placeholder="Например, Анна Рузич" value="${escapeHtml(state.name)}"><p class="error-text" role="alert">Укажите имя и фамилию</p></div>
    <div class="field" id="email-field"><label for="email">Почта</label><input id="email" type="email" autocomplete="email" value="${escapeHtml(state.email)}"><p class="hint">Пришлём сюда детали заявки</p><p class="error-text" role="alert">Проверьте адрес почты</p></div>
    <div class="field"><label for="phone">Телефон</label><input id="phone" class="locked" value="+7 999 123-45-67" readonly aria-readonly="true"><p class="hint">Номер указан в профиле и изменить его нельзя</p></div>
  `, `<button class="primary" type="button" data-action="contacts-next">Продолжить</button>`);
}

function renderPlans() {
  const helpVisible = state.object && true;
  return layout(`
    <h1>Расскажите о планах</h1><p class="lead">Так мы поймём, с чего начать разговор.</p>
    <fieldset class="field"><legend class="fieldset-label">Когда планируете покупку?</legend><div class="choice-grid">
      ${choice("В течение месяца", "В течение месяца", state.purchase, "purchase")}
      ${choice("Через 1–3 месяца", "Через 1–3 месяца", state.purchase, "purchase")}
      ${choice("Через 3–6 месяцев", "Через 3–6 месяцев", state.purchase, "purchase")}
      ${choice("Пока просто изучаю", "Пока просто изучаю", state.purchase, "purchase")}
    </div></fieldset>
    <fieldset class="field"><legend class="fieldset-label">Есть объект для покупки?</legend><div class="choice-grid">
      ${choice("Да, объект уже выбран", "Да, объект уже выбран", state.object, "object")}
      ${choice("Пока выбираю", "Пока выбираю", state.object, "object")}
      ${choice("Хочу понять бюджет", "Хочу понять бюджет", state.object, "object")}
    </div></fieldset>
    <div class="conditional ${helpVisible ? "visible" : ""}">
      <fieldset class="field"><legend class="fieldset-label">Нужна помощь с подбором?</legend><p class="hint">Для семейной ипотеки и новостроек</p><div class="choice-grid">
        ${choice("Да, хочу консультацию", "Да, хочу консультацию", state.needHelp, "help")}
        ${choice("Нет, подберу сам(а)", "Нет, подберу сам(а)", state.needHelp, "help")}
      </div></fieldset>
    </div>
  `, `<button class="primary" type="button" data-action="plans-next">Продолжить</button>`);
}

function renderFinances() {
  return layout(`
    <h1>Оценим бюджет</h1><p class="lead">Можно приблизительно — это не банковская анкета.</p>
    <fieldset class="field"><legend class="fieldset-label">Ваш доход в месяц</legend><div class="chips">
      ${["До 100 тыс. ₽", "100–200 тыс. ₽", "200–350 тыс. ₽", "Больше 350 тыс. ₽"].map(item => `<button type="button" class="chip ${state.income === item ? "selected" : ""}" data-choice="income" data-value="${item}">${item}</button>`).join("")}
    </div></fieldset>
    <div class="section-divider"></div>
    <fieldset class="field"><legend class="fieldset-label">Есть действующие кредиты?</legend><div class="choice-grid">
      ${choice("Да", "Да", state.hasLoans, "loans")}
      ${choice("Нет", "Нет", state.hasLoans, "loans")}
    </div></fieldset>
    <div class="conditional ${state.hasLoans === "Да" ? "visible" : ""}">
      <div class="field" id="payment-field"><label for="payment">Платёж по кредитам в месяц</label><input id="payment" inputmode="numeric" placeholder="Например, 25 000" value="${escapeHtml(state.loanPayment)}"><p class="error-text" role="alert">Укажите сумму платежа</p></div>
    </div>
    <div class="info-line"><span>ⓘ</span><div>Эксперт поможет с расчётом и расскажет, как кредиты могут повлиять на одобрение.</div></div>
  `, `<button class="primary" type="button" data-action="finances-next">Продолжить</button>`);
}

function renderCallback() {
  const slots = ["Сегодня, 23 ноября · 18:00–20:00", "Завтра, 24 ноября · 10:00–12:00", "Ср, 25 ноября · 15:00–17:00"];
  return layout(`
    <h1>Когда удобно созвониться?</h1><p class="lead">Эксперт позвонит в один из ближайших трёх дней.</p>
    <fieldset class="field"><legend class="fieldset-label">Выберите время</legend><div class="choice-grid">
      ${slots.map(slot => choice(slot, slot, state.callback, "callback")).join("")}
    </div></fieldset>
    <div class="section-divider"></div>
    <label class="check"><input id="marketing" type="checkbox" ${state.marketing ? "checked" : ""}><span>Хочу получать новости об ипотеке и выгодных предложениях Циана</span></label>
    <p class="legal">Нажимая «Продолжить», вы принимаете <a href="#">условия обработки персональных данных</a> и <a href="#">пользовательское соглашение</a>.</p>
  `, `<button class="primary" type="button" data-action="submit">Продолжить</button>`);
}

function renderSuccess() {
  return layout(`
    <div class="success"><div class="success-mark">✓</div><h1>Заявка у эксперта</h1><p class="lead">Мы передали ваши ответы ипотечному партнёру.</p>
      <div class="call-card"><strong>Позвоним ${escapeHtml(state.callback)}</strong><p>Эксперт уточнит детали, поможет с расчётом и расскажет о следующих шагах.</p></div>
      <p class="hint">Документы и информацию о работодателе сейчас не нужны.</p>
    </div>
  `, `<button class="secondary" type="button" data-action="change-time">Изменить время звонка</button>`);
}

function render() {
  const screens = {"-1": renderIntro, "0": renderContacts, "1": renderPlans, "2": renderFinances, "3": renderCallback, "4": renderSuccess};
  app.innerHTML = screens[state.step]();
  bindEvents();
}

function setFieldError(id, invalid) {
  document.querySelector(id)?.classList.toggle("error", invalid);
}

function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function bindEvents() {
  document.querySelectorAll("[data-choice]").forEach(button => button.addEventListener("click", () => {
    const group = button.dataset.choice;
    const key = {purchase:"purchase", object:"object", help:"needHelp", income:"income", loans:"hasLoans", callback:"callback"}[group];
    state[key] = button.dataset.value;
    render();
  }));
  document.querySelector("[data-action='start']")?.addEventListener("click", () => { state.step = 0; render(); });
  document.querySelector("[data-action='back']")?.addEventListener("click", () => { state.step = Math.max(-1, state.step - 1); render(); });
  document.querySelector("[data-action='contacts-next']")?.addEventListener("click", () => {
    state.name = document.querySelector("#name").value.trim(); state.email = document.querySelector("#email").value.trim();
    const nameInvalid = state.name.split(/\s+/).filter(Boolean).length < 2; const emailInvalid = !validEmail(state.email);
    setFieldError("#name-field", nameInvalid); setFieldError("#email-field", emailInvalid);
    if (!nameInvalid && !emailInvalid) { state.step = 1; render(); }
  });
  document.querySelector("[data-action='plans-next']")?.addEventListener("click", () => {
    if (!state.purchase || !state.object || !state.needHelp) { alert("Выберите вариант в каждом вопросе"); return; } state.step = 2; render();
  });
  document.querySelector("[data-action='finances-next']")?.addEventListener("click", () => {
    state.loanPayment = document.querySelector("#payment")?.value.trim() || state.loanPayment;
    if (!state.income || !state.hasLoans) { alert("Выберите доход и ответьте про кредиты"); return; }
    const invalidPayment = state.hasLoans === "Да" && !state.loanPayment; setFieldError("#payment-field", invalidPayment);
    if (!invalidPayment) { state.step = 3; render(); }
  });
  document.querySelector("[data-action='submit']")?.addEventListener("click", () => {
    state.marketing = document.querySelector("#marketing")?.checked || false;
    if (!state.callback) { alert("Выберите удобное время звонка"); return; } state.step = 4; render();
  });
  document.querySelector("[data-action='change-time']")?.addEventListener("click", () => { state.step = 3; render(); });
}

render();
