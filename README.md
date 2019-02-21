# phelomi

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### JSON Generator
到網址：https://next.json-generator.com/
貼上 server/initJson/jsonGenerator.js

### 導入資料到資料庫中
```
mongoimport -d phelomi -c <collection> <file> --jsonArray
```

### 目前已有假资料导入指令
mongoimport --db phelomi --collection orders server/db/initJson/order.json --jsonArray
mongoimport --db phelomi --collection rooms server/db/initJson/room.json --jsonArray
mongoimport --db phelomi --collection routers server/db/initJson/router.json --jsonArray
mongoimport --db phelomi --collection cashes server/db/initJson/cash.json --jsonArray
mongoimport --db phelomi --collection locations server/db/initJson/location.json --jsonArray

*注：user和role有包含objectId的參數，不適合直接import，取而代之，直接通過後台的功能手動生成。
*TODO: 導出資料庫，方便假資料遷移*

mongoimport --db phelomi --collection users server/db/initJson/user.json --jsonArray


導出指令
mongoexport --db phelomi --collection users --out user.json --jsonArray

### 備份與還原資料庫
mongodump --db phelomi
mongorestore --db phelomi server/db/exportJson/dump/phelomi/

### 新建資料庫操作
mongoimport --db phelomi --collection routers server/db/initJson/router.json --jsonArray
