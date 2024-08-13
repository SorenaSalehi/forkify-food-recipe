//new:this module also must be in ant application

import { reject } from "core-js/./es/promise";
import { TIMEOUT_SEC } from "./config";

//Rejecting fetch timer
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long , rejected after ${s} Second`));
    }, s * 1000);
  });
};
//This will contain All the repeated function
// export const getJson = async function (url) {
//   try {
//     //cm:each response that came soon, will be promise
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} : ${data.status}`);
//     return data;
//   } catch (err) {
//     //tip:We want to get this error in the model file,but whit this we dont get that
//     console.error(err);
//     //cm:We should THROW this error to get that other side
//     throw err;
//   }
// };
//
// //Sending Data to API
// export const sendJson = async function (url, uploadRecipe) {
//   try {
//     //Sending data to API , need the url and options
//     const fetchPro = fetch(url, {
//       //1.
//       method: "POST",
//       //2.information about request
//       //cm:We telling to the API that we send data in the json type
//       headers: {
//         "Content-Type": "application/json",
//       },
//       //3.Data that we want to send:
//       body: JSON.stringify(uploadRecipe),
//     });
//
//     //steal we want timeout:
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//
//     //Even want to data response:
//     const data = await res.json();
//
//     //Error handler:
//     if (!res.ok) throw new Error(`${data.message} : (${res.status})`);
//
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

//refactoring:
export const AJAX = async function (url, uploadRecipe = undefined) {
  try {
    const fetchPro = uploadRecipe
      ? await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadRecipe),
        })
      : await fetch(url);
    //steal we want timeout:
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    //Even want to data response:
    const data = await res.json();

    //Error handler:
    if (!res.ok) throw new Error(`${data.message} : (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
