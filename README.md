# ESLAB-hw2

### Download released version here

https://github.com/changhc/ESLAB-hw2/releases

Unzip the file.

There are 3 directories: ```UI```, ```server``` and ```tessel```.

### Usage

  backend：

  (for server)
  
  1. ```cd ./server```
  
  2. ```npm install```
  
  3. ```node server.js```

  (for tessel)

  1. ```cd ./tessel```
  
  2. ```npm install```
  
  3. (IMPORTANT!) Change ```remoteDomain``` in ```index.js``` according to the web server's domain name or public IP.

  4. ```t2 run index.js```

  frontend：

  1. ```cd ./UI```

  2. (Optional) Change the fetch function in ```MapApp.js``` and ```DataBar.js``` according to your server API endpoint. 
  
  (default: ```localhost:3000/api/```)
  
  3. ```npm install```
  
  4. ```npm run dev```
  
  5. Open http://localhost:8000 in your browser.


### Discussion & API List

    https://hackpad.com/ES-hw2-Mvwf4Xn5Hk5
