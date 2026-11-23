# Ипотека без длинной анкеты · Циан

Промо-ролик короткой ипотечной анкеты, собран скиллом `product-motion`.

- Статус: готово, визуально проверено контактным листом и `verify_media.py`.
- Итог: `out/mortgage-promo_9x16.mp4` — 1080×1920, 15 секунд, H.264, без звука, 911 КБ.
- Сцены: один крупный iPhone почти на весь вертикальный кадр — старт, контакты, доход, объект, время звонка и подтверждение.
- Бренд-профиль: `brand/`, Manrope (OFL) с цветами прототипа. Использованы только данные и экраны текущей анкеты.

## Бриф

Фича: короткая ипотечная анкета. Назначение: промо. Аудитория: пользователи, которые хотят узнать шансы на одобрение ипотеки. Язык: русский. Формат: вертикальный 9:16. Озвучки и музыки нет.

## Пересборка

Проверка кадров:

```bash
../../.venv/bin/python ../../.agents/skills/product-motion/scripts/verify_scene.py video.html --fmt v --qs subs=0
../../.venv/bin/python ../../.agents/skills/product-motion/scripts/render.py video.html stills --fmt v --qs subs=0 --sheet
```

Рендер:

```bash
../../.venv/bin/python ../../.agents/skills/product-motion/scripts/render.py video.html video --fmt v --qs subs=0 --out out/mortgage-promo_9x16.mp4
```
