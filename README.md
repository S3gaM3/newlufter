# newlufter — клиент (статический сайт)

Сайт LUFTER: каталог алмазных дисков и коронок. Полностью клиентская часть, без сервера.

## Запуск

```bash
npm install
npm run dev    # разработка
npm run build  # сборка в dist/
npm run preview # просмотр собранного
```

## Изображения

**Важно:** Файлы в `public/images/` должны быть в репозитории — иначе на GitHub Pages картинки не отобразятся.

- `public/images/logo.png`, `pattern.jpg`, `lyufter_fon.png`, `lyufter_fon_mobile.png`, `bg.png` и др. (см. `src/constants/site.ts`)
- `public/images/disks/{sku}.png` — фото дисков (например `002-125.png`)
- `public/images/1_sajt_razdely_2.png`, `2_sajt_razdely_2.png` — для коронок и дисков

Запуск `node scripts/download-images.mjs` загружает изображения товаров в `public/images/disks/`. Остальные картинки добавьте вручную.

## Деплой

Собранный `dist/` — статические файлы. GitHub Actions собирает и публикует на GitHub Pages при push в `main`.
