migrations: 
- https://www.npmjs.com/package/sequelize-cli
- https://www.youtube.com/watch?v=Mdib18k7rug&t=583s&ab_channel=FullStackMastery (how create models & migration)
- https://www.youtube.com/watch?v=XvCcyqB96Yg&ab_channel=RuiWang (how create associations)

for example:
- yarn sequelize db:drop
- yarn sequelize db:create
- yarn sequelize model:generate --name user --attributes email:string,password:string

associations(relationships) you need to custom make it from this lesson:
- https://www.youtube.com/watch?v=XvCcyqB96Yg&ab_channel=RuiWang

use sequelize-cli and typescript is bad, need to use or sequelize-cli or typescript,
or try typeorm or another orm with typescript
because i can't call models which was ganerated after migration
in this video, all is ok(js + sequalize-cli):
- https://www.youtube.com/watch?v=3qlnR9hK-lQ&ab_channel=Classsed

for typescript better use: sequelize-cli-typescript
but anyway i cloudn't import model after generate them