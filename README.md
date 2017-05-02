# ESLAB-hw2

### 使用說明

master branch 內的檔案並無作用，我們將會用到的程式碼分別放在 UI 以及 backend 兩個 branch

UI branch 放的是前端的部份

backend branch 主要是負責後端伺服器以及 Tessel 2 的程式碼


### 使用方法

  UI：

  1. 需要先確認 API 為本地或者是遠端，依此去更改 MapApp.js 以及 DataBar.js 內的 fetch

  2. 再來則是執行 ```npm run dev``` 之後在瀏覽器開啟 ```localhost:8000``` 即可連到網站

  backend：

  1. 在 server 和 tessel 資料夾下分別執行 ```npm install```

  2. Web server: ```node server.js```

  3. 得到 Web server 的 Domain name 或 public IP 後，修改 tessel 的 index.js 的 ```remoteDomain```
  
  4. 在 tessel 資料夾下執行 ```t2 run index.js```

### 合併使用

把 compile 完的 html, js, css 放入 server 資料夾的 src 資料夾內，啟動 server 即可。




### 討論&API List

    https://hackpad.com/ES-hw2-Mvwf4Xn5Hk5
