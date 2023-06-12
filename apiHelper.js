/**********
Usage: This function is using for API settings/ API Data. Params as follow->
@url: url structure
@methodType: method type (POST, GET etc)
@logFile: using for log errors
@mandateCity: if user select Manadate city 
@url: url structure
@methodType: method type (POST, GET, PUT)
@logFile: using for log errors
@mandateCity: if user select Manadate city 
***********/

//FOR DEV
// const svinfo = process.env.serverConfig
// console.log(svinfo)
const {url_next,url_api,url_csgenio,url_fastapi,wrapperUrl,url_php} = process.env.serverConfig;
const APIConfig = {
  url_next: url_next, //NextJs server
  url_api: url_api, // Node API
  url_csgenio: url_csgenio,
  url_fastapi: url_fastapi,
  wrapperUrl : wrapperUrl,
  url_php:url_php
};

//FOR UAT
// const APIConfig = {
//   url_next: '192.168.24.133:3006', //NextJs server
//   url_api: '192.168.24.133:3005', // Node API
//   url_csgenio: 'http://192.168.24.133:81',
//   url_fastapi: '192.168.24.133:3007',//FastAPI
//   wrapperUrl : 'http://192.168.24.133:81/vaccounts/PHP/wrapper/',
// };

/*
//FOR LIVE
const APIConfig = {
  url_next: '192.168.24.133:3006', //NextJs server
  url_api: '192.168.24.133:3005', // Node API
  url_csgenio: 'http://192.168.24.133:81/',
  url_fastapi: '192.168.24.133:3007',//FastAPI
  wrapperUrl : 'http://192.168.24.133:81/vaccounts/PHP/wrapper/',
};
*/

async function getUserData(){
  try{
    const empId = localStorage.getItem('empId');
    const data_city = localStorage.getItem('data_city');
    const storeValue = {empId,data_city};
    return storeValue
  }
  catch(err){
    // console.log(err)
    return {}
  } 
}

async function AccountsApi(url, methodType, params, logFile = '', mandateCity = '') {

  let userData = await getUserData();
    if(Object.keys(userData).length > 0){
      params = {...params,data_city:userData.data_city,userId:userData.empId}
    }

  let paramsdata = '';
  let data_src = '';

  if (mandateCity !== '') {
    paramsdata = mandateCity;
  } else if (data_src == 'remotecity') {
    paramsdata = 'remote';
  }

  params.data_city != '' ? (paramsdata = '') : (params = { ...params, data_city: paramsdata });

  /* For FastAPI */
  let api_url = APIConfig.url_api
  if(params.api_src !== undefined && params.api_src == "fastapi"){
    api_url = APIConfig.url_fastapi;
  }

  //console.log(params);
  if (methodType && methodType != '') {
    switch (methodType.toUpperCase()) {
      case 'POST':
        try {
          const response = await fetch(`http://${api_url}/${url}`, {
            method: methodType.toUpperCase(),
            body: JSON.stringify(params),
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const resultData = await response.json();

          return resultData;
        } catch (err) {
          console.log(err);
        }

        break;

      case 'GET':
        let UrlParam = new URLSearchParams(params);
        let getURL = `http://${APIConfig.url_api}/${url}?${UrlParam}`;

        try {
          const response = await fetch(getURL, { cache: 'no-store' });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const resultData = await response.json();
          return resultData;
        } catch (err) {
          console.log(err);
        }
        break;

      case 'PUT':
        try {
          const response = await fetch(`http://${APIConfig.url_next}/${url}`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const resultData = await response.json();
          return resultData;
        } catch (err) {
        }
        break;

      default:
        console.log('Method Not Set');
  
        break;
    }
  } else {
    console.log('Method Not Set');
  }
}

async function NextApi(url, methodType, params){
 
  let paramsdata = '';
  let data_src = '';
  
  let userData = await getUserData();
  if(Object.keys(userData).length > 0){
    params = {...params,data_city:userData.data_city,userId:userData.empId}
  }

  if (methodType && methodType != '') {
    switch (methodType.toUpperCase()) {
      case 'POST':
      case 'PUT':
        try {
          const response = await fetch(`http://${APIConfig.url_next}/${url}`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const resultData = await response.json();
          return resultData;
        } catch (err) {

        }
      break;

      default:
        console.log('Method Not Set');
        break;
    }
  } else {
    console.log('Method Not Set');
  }
}

const setLogs = (logs,filename) => {
  logs = {...logs, filename} 
  try {
    fetch(`http://${APIConfig.url_next}/api/setLogs`, {
      method: 'POST',
      body: JSON.stringify(logs),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.log(err);
  }
};

export { AccountsApi, NextApi, APIConfig, setLogs };
