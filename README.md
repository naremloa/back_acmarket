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

### 導入資料到資料庫中國年
```
mongoimport -d phelomi -c <collection> <file> --jsonArray
```

### 目前已有假资料导入指令
mongoimport --db phelomi --collection orders server/db/initJson/order.json --jsonArray
mongoimport --db phelomi --collection rooms server/db/initJson/room.json --jsonArray
mongoimport --db phelomi --collection routers server/db/initJson/router.json --jsonArray
mongoimport --db phelomi --collection cashs server/db/initJson/cash.json --jsonArray

mongoimport --db phelomi --collection users server/db/initJson/user.json --jsonArray