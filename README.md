Express, TS, Sequelize/TypeOrm, PG
migrations:
- https://www.npmjs.com/package/sequelize-cli
- https://www.youtube.com/watch?v=Mdib18k7rug&t=583s&ab_channel=FullStackMastery (how create models & migration)
- https://www.youtube.com/watch?v=XvCcyqB96Yg&ab_channel=RuiWang (how create associations)
migrations:
- https://www.npmjs.com/package/sequelize-cli
- https://www.youtube.com/watch?v=Mdib18k7rug&t=583s&ab_channel=FullStackMastery (how create models & migration)
- https://www.youtube.com/watch?v=XvCcyqB96Yg&ab_channel=RuiWang (how create associations)

for example:
- yarn sequelize db:drop
- yarn sequelize db:create
- yarn sequelize model:generate --name user --attributes email:string,password:string

associations(relationships) тебе надо вручную настроить с этого туторила:
- https://www.youtube.com/watch?v=XvCcyqB96Yg&ab_channel=RuiWang

seuqelize-cli - библиотека для миграций
seuqelize - орм на джс
seuqelize-typescript - таже орм только теперь на декораторах, не понятно только как сюда миграции притулить

то что попробовал:
1. express + typescript + seuqelize +  seuqelize-cli + postgres = плохо, миграции так и не получилось сделать, ругается на то что невозможно импортировать модель в сервис, имеется ввиду модлеь которая сгенерилась после model:generate 
Единственный кейс который работал - это иметь две папки models одна с моделями для миграций(там просто синтаксис отличается), а другая через которую мы будем использовать в коде для работы с БД. Но там много ошибок, тайпскрипт ругался, заглушить их не получалось
Хотя тут все норм, у него тут одна папка models откуда он все импортит, но тут js + sequalize-cli: https://www.youtube.com/watch?v=3qlnR9hK-lQ&ab_channel=Classsed

2. express + typescript + seuqelize + seuqelize-cli-typescript + postgres = не дало результата так как тоже не мог ипортировать модлей в сервис, но за то миграции были с тайпскриптом, но притиер ругался так как там ЕS5 а не ES6
Единственный кейс может сработать, я не пробовал, только с 1м вариком это работало - это иметь две папки models одна с моделями для миграций(там просто синтаксис отличается), а другая через которую мы будем использовать в коде для работы с БД. Но там много ошибок, тайпскрипт ругался, заглушить их не получалось

3. express + typescript + sequelize-typescript(https://www.npmjs.com/package/sequelize-typescript) + postgress = думаю что с миграции тут вообще не получится, или мол миграции и ещё дополнительные модели через которые будем обращаться в БД. И так же sequelize-typescript выглядит как TypeORM на декораторах, тогда может уже лучше сразу TypeORM использовать?
статься с кодом: https://dev.to/franciscomendes10866/how-to-use-sequelize-orm-with-typescript-3no

4. express + typescript + TypeORM + migrations + postgres = надо понять как это делать, так как ни разу юзал такой кейс
тут много уроков можно найти как это все сделать:
https://wanago.io/2019/01/28/typeorm-migrations-postgres/
или тут просто как с TypeORM работать:
https://javascript.plainenglish.io/create-a-rest-api-with-express-postgresql-typeorm-and-typescript-ac42a20b66c7

- Вердикт пока такой если хотим seuqelize с миграциями то надо чистый js использовать для этого express + seuqelize-cli без typescript
Или попробовать express + typescript + TypeORM + migrations + postgres (4й кейс)
