# ESLAB-hw2

### Download released version here

```https://github.com/changhc/ESLAB-hw2/releases```

Unzip the file. There are 3 directories: UI, server and tessel.



### Usage

  frontend：

  1. 需要先確認 API 為本地或者是遠端，依此去更改 MapApp.js 以及 DataBar.js 內的 fetch

  2. 再來則是執行 ```npm run dev``` 之後在瀏覽器開啟 ```localhost:8000``` 即可連到網站

  backend：

  1. 在 server 和 tessel 資料夾下分別執行 ```npm install```

  2. Web server: ```node server.js```

  3. 得到 Web server 的 Domain name 或 public IP 後，修改 tessel 的 index.js 的 ```remoteDomain```
  
  4. 在 tessel 資料夾下執行 ```t2 run index.js```



### Discussion & API List

    https://hackpad.com/ES-hw2-Mvwf4Xn5Hk5
