# Remote Testing System texnik stack tavsifi

## Umumiy ko‘rinish

Ushbu loyiha masofaviy test topshirish tizimi bo‘lib, asosiy texnik stack sifatida `Next.js`, `React`, `TypeScript`, `Supabase` va `Tailwind CSS` dan foydalanadi. Loyiha arxitekturasi full-stack yondashuvga yaqin: frontend ham, server logikasi ham bitta Next.js ilova ichida boshqariladi.

Loyihada quyidagi asosiy yo‘nalishlar mavjud:

- foydalanuvchini autentifikatsiya qilish
- admin va student rollarini ajratish
- test va competition jarayonlarini yuritish
- natijalarni saqlash va ko‘rsatish
- server va client o‘rtasidagi ishni soddalashtirish
- deploymentni Vercel orqali boshqarish

## Asosiy texnologiyalar nima vazifa bajaradi

### Next.js

`Next.js` ushbu loyihaning asosiy frameworki hisoblanadi. U frontend va backendga oid ko‘p vazifalarni bitta platformada bajarishga imkon beradi.

Bu loyihada `Next.js` quyidagi vazifalarni bajaradi:

- sahifalarni marshrutlash va papka asosidagi routingni boshqaradi
- `App Router` orqali sahifa, layout va nested route tuzilmasini tashkil qiladi
- server component va client componentlarni ajratib ishlatishga imkon beradi
- server actionlar orqali forma yuborish, ma’lumot yozish va o‘zgartirish ishlarini bajaradi
- middleware orqali himoyalangan sahifalarga kirishni nazorat qiladi
- production build va optimizatsiyani boshqaradi
- security headerlar va server konfiguratsiyalarini markazlashtiradi

Qisqasi, bu loyiha ichida `Next.js` ham UI qatlamini, ham server tarafdagi biznes logikaning muhim qismini ushlab turadi.

### React

`React` foydalanuvchi interfeysini qurish uchun ishlatiladi. Next.js o‘zi React asosida ishlaydi, shu sababli barcha sahifalar va komponentlar React paradigmasida yozilgan.

Bu loyihada `React` quyidagi vazifalarni bajaradi:

- qayta ishlatiladigan UI komponentlar yaratadi
- sahifa ichidagi interaktiv qismlarni boshqaradi
- foydalanuvchi harakatlariga javob qaytaradi
- test runner, join button, delete button kabi interaktiv elementlarni ishlatadi

### TypeScript

`TypeScript` kodning ishonchliligini oshirish uchun ishlatiladi. U tiplar orqali xatolarni development jarayonida oldindan ushlashga yordam beradi.

Bu loyihada `TypeScript` quyidagi vazifalarni bajaradi:

- component prop-larini aniq belgilaydi
- server va client o‘rtasidagi ma’lumot shaklini nazorat qiladi
- rol, natija, test, competition kabi obyektlar bilan ishlashni xavfsiz qiladi
- katta kod bazada refactor qilishni yengillashtiradi

### Supabase

`Supabase` ushbu loyihaning backend-as-a-service qatlami hisoblanadi. U autentifikatsiya, ma’lumotlar bazasi va session boshqaruvini soddalashtiradi.

Bu loyihada `Supabase` quyidagi vazifalarni bajaradi:

- foydalanuvchini ro‘yxatdan o‘tkazish va tizimga kiritish
- session va cookie orqali login holatini saqlash
- `profiles`, testlar, urinishlar, competition va natijalarni saqlash
- admin va student rollarini bazada boshqarish
- server tarafda xavfsiz so‘rov yuborish

Amalda bu loyiha uchun `Supabase` bir vaqtning o‘zida autentifikatsiya servisi ham, asosiy ma’lumotlar ombori ham hisoblanadi.

### PostgreSQL

Supabase ichida asosiy ma’lumotlar bazasi sifatida `PostgreSQL` ishlatiladi. Loyiha bevosita PostgreSQL drayveri bilan emas, Supabase orqali ishlaydi.

`PostgreSQL` quyidagi vazifalarni bajaradi:

- testlar va savollarni saqlaydi
- foydalanuvchi rollarini saqlaydi
- urinishlar va natijalarni saqlaydi
- competition ma’lumotlarini saqlaydi
- relational data model orqali bog‘langan jadvallar bilan ishlashni ta’minlaydi

### Tailwind CSS

`Tailwind CSS` loyihaning styling qatlami uchun ishlatiladi. U utility-first yondashuv orqali UI yozishni tezlashtiradi.

Bu loyihada `Tailwind CSS` quyidagi vazifalarni bajaradi:

- sahifalar va komponentlarga stil berish
- spacing, rang, border, typography va layoutlarni boshqarish
- tez prototiplash va bir xil vizual uslubni saqlash

### Vercel

`Vercel` loyihani deploy qilish uchun tanlangan platforma. `vercel.json` fayli orqali build va security headerlar boshqarilgan.

Bu loyihada `Vercel` quyidagi vazifalarni bajaradi:

- production deploymentni ishga tushiradi
- `Next.js` ilovasini native tarzda host qiladi
- build, install va dev commandlarni boshqaradi
- ayrim xavfsizlik headerlarini productionga qo‘llaydi

### ESLint

`ESLint` kod sifatini nazorat qilish uchun ishlatiladi.

Bu loyihada `ESLint` quyidagi vazifalarni bajaradi:

- noto‘g‘ri yozilgan yoki xavfli patternlarni aniqlaydi
- Next.js va TypeScript uchun tavsiya etilgan qoidalarni tekshiradi
- kod bazani bir xil standartda ushlab turishga yordam beradi

### PostCSS

`PostCSS` CSS build pipeline ichida ishlatiladi. Bu yerda u asosan `Tailwind CSS v4` integratsiyasi uchun kerak.

### OpenAPI hujjatlashuvi

Loyihada `docs/openapi.yaml` mavjud. Bu ishlab chiqish jamoasi yoki integratsiya qiluvchi tomonlarga tizim API yuzasi qanday ko‘rinishini hujjatlashtirish uchun kerak.

Bu hujjat real backend endpointlaridan ko‘ra ko‘proq konseptual tavsif vazifasini bajaradi, chunki loyihada ko‘p ishlar `Next.js Server Actions` va `Supabase` bilan ichki tarzda bajarilgan.

## Arxitektura bo‘yicha stack qatlamlari

### 1. Frontend qatlami

Frontend qismida quyidagilar ishlatilgan:

- `Next.js App Router`
- `React`
- `Tailwind CSS`
- `NProgress` orqali navigatsiya progress indikatori
- `next/font` orqali `Geist` va `Geist Mono` shriftlari

Bu qatlam foydalanuvchi ko‘radigan barcha sahifalar, dashboard, formalar, kartalar, jadval va interaktiv komponentlarni beradi.

### 2. Server qatlami

Server qismida quyidagilar ishlatilgan:

- `Next.js Server Actions`
- `Next.js Middleware`
- `next/headers` va cookie boshqaruvi
- role-based access control logikasi

Bu qatlam foydalanuvchini tekshirish, ruxsat darajasini ajratish, ma’lumotlarni xavfsiz yozish va o‘qish kabi ishlarni bajaradi.

### 3. Backend service qatlami

Bu qatlamda quyidagilar ishlatilgan:

- `Supabase Auth`
- `Supabase Database`
- `Supabase SSR client`
- `Supabase service role` client

Bu qatlam session, login, database query va server tarafdagi maxsus imtiyozli amallarni bajaradi.

## Paketlar va ularning vazifalari

Quyida `package.json` ichidagi paketlar vazifasi keltirilgan.

### Asosiy dependency paketlar

| Paket                   | Vazifasi                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `next`                  | Loyihaning asosiy full-stack frameworki. Routing, server rendering, middleware, layout, server actions va build jarayonlarini boshqaradi.                    |
| `react`                 | UI komponentlar va interaktiv interfeysni yaratadi.                                                                                                          |
| `react-dom`             | React komponentlarini brauzerga render qilish uchun kerak. Next.js ichida React bilan birga ishlaydi.                                                        |
| `@supabase/supabase-js` | Supabase bilan ishlash uchun asosiy JavaScript klienti. Database, auth va boshqa Supabase servislariga ulanishda ishlatiladi.                                |
| `@supabase/ssr`         | Next.js server muhiti va SSR jarayonlarida Supabase session/cookie boshqaruvini to‘g‘ri ishlatish uchun kerak. Middleware va server client yaratishda muhim. |
| `zod`                   | Ma’lumotlarni validatsiya qilish va shaklini tekshirish uchun ishlatiladi. Forma ma’lumotlari yoki serverga keladigan inputlarni nazorat qilishda foydali.   |
| `nprogress`             | Sahifa almashganda yuqorida progress bar ko‘rsatish uchun ishlatiladi. UXni yaxshilaydi.                                                                     |
| `@types/nprogress`      | `nprogress` paketi uchun TypeScript tiplarini beradi.                                                                                                        |

### Development dependency paketlar

| Paket                         | Vazifasi                                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `typescript`                  | Statik tip tekshiruvi va TypeScript compiler imkoniyatlarini beradi.                                                                                   |
| `@types/node`                 | Node.js APIlari uchun TypeScript tiplarini beradi.                                                                                                     |
| `@types/react`                | React uchun TypeScript tiplarini beradi.                                                                                                               |
| `@types/react-dom`            | React DOM uchun TypeScript tiplarini beradi.                                                                                                           |
| `eslint`                      | Kodni lint qilish, xatolar va nojo‘ya patternlarni aniqlash uchun ishlatiladi.                                                                         |
| `eslint-config-next`          | Next.js va React uchun tayyor ESLint qoidalar to‘plami. Core Web Vitals va TypeScript bilan integratsiyani soddalashtiradi.                            |
| `tailwindcss`                 | Utility-first CSS framework. Dizayn va layout yozishni tezlashtiradi.                                                                                  |
| `@tailwindcss/postcss`        | Tailwind CSS’ni PostCSS pipeline ichida ishlatish uchun adapter vazifasini bajaradi.                                                                   |
| `babel-plugin-react-compiler` | React compiler bilan ishlashga yordam beradi. Bu loyiha `reactCompiler` konfiguratsiyasidan foydalangani uchun optimizatsiya qatlamida ahamiyatga ega. |

## Next.js ichida qo‘llanilgan muhim imkoniyatlar

Loyihada oddiy Next.js emas, uning bir nechta muhim funksional imkoniyatlari ham ishlatilgan:

- `App Router` asosidagi route struktura
- `layout.tsx` orqali umumiy layoutlar
- `page.tsx` orqali sahifalar
- `middleware.ts` orqali himoyalangan route nazorati
- `Server Actions` orqali serverda bajariladigan amallar
- `next/navigation` orqali redirect va navigatsiya ishlari
- `next/headers` orqali cookie va request context bilan ishlash
- `next/font/google` orqali shriftlarni optimallashtirilgan tarzda ulash

Bu yondashuv alohida Express backend yozmasdan turib, bitta Next.js repo ichida to‘liq ishlaydigan tizim qurishga yordam beradi.

## Supabase ichida qo‘llanilgan muhim yondashuvlar

Loyihada Supabase oddiy client ulash darajasida emas, bir nechta rejimda ishlatilgan:

### Browser client

Brauzer tarafida ishlaydigan Supabase client foydalanuvchi sessiyasi bilan ishlash uchun kerak. Bu qism client-side interaktiv holatlar uchun mos.

### Server client

Server tarafdagi Supabase client `cookies` bilan birga ishlaydi va foydalanuvchini serverda tekshirish, himoyalangan sahifalarda auth holatini aniqlash uchun kerak.

### Service role client

`SUPABASE_SERVICE_ROLE_KEY` bilan ishlaydigan alohida client server tarafdagi kuchli ruxsat talab qiladigan amallar uchun kerak. Bu odatda oddiy foydalanuvchiga berilmaydigan huquqlarni bajaradi.

## Loyiha bo‘yicha amaliy texnik xulosa

Ushbu loyiha stacki zamonaviy `Next.js + Supabase` kombinatsiyasiga qurilgan. Bu kombinatsiya ayniqsa MVP va tez ishga tushiriladigan admin/student tipidagi tizimlar uchun juda qulay.

Bu stackning asosiy afzalliklari:

- frontend va backendni bitta repo ichida yuritish mumkin
- autentifikatsiya va ma’lumotlar bazasini tez ulash mumkin
- deployment jarayoni soddalashadi
- TypeScript sababli kod ishonchliligi oshadi
- Tailwind sababli interfeysni tez yig‘ish mumkin

Qisqa qilib aytganda:

- `Next.js` ilovaning asosiy frameworki
- `React` interfeysni chizadi
- `TypeScript` kodni xavfsizroq qiladi
- `Supabase` auth va database vazifasini bajaradi
- `Tailwind CSS` dizayn va layoutni boshqaradi
- `Vercel` loyihani productionga chiqaradi
- `ESLint` kod sifatini nazorat qiladi
- `Zod` kiritilgan ma’lumotlarni tekshiradi
- `NProgress` foydalanuvchi tajribasini yaxshilaydi

## Kim uchun tushunarli model

Agar loyihani juda sodda tilda tasavvur qilsak, u quyidagicha ishlaydi:

- `Next.js` butun tizimning karkasi
- `React` foydalanuvchi ko‘radigan ekranlar
- `Supabase` foydalanuvchi va ma’lumotlarni saqlaydigan servis
- `TypeScript` xatolarni oldindan ushlaydigan nazorat qatlami
- `Tailwind CSS` tashqi ko‘rinishni tez quradigan stil vositasi
- `Vercel` esa tayyor ilovani internetga chiqaradigan platforma

Shu sababli, loyiha stacki amaliy, zamonaviy va MVP darajadagi ta’lim yoki test platformasi uchun mos tanlangan.
