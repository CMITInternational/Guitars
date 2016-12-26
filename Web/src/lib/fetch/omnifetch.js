import promiseRetry from 'promise-retry';

export default function omniFetch (URL) {
  let twoH = 200;
  let threeH = 300;
  return promiseRetry((retry) => {
    return fetch(URL, {
      mode: 'cors',
      method: 'get',
      headers: {'Accept': 'application/json', 'Content-type': 'application/json'},
      credentials: 'include'
    }).catch(retry);
  }, {
    retries: 5
  }).then((response) => {
    const omniFetchResponse = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
    if (twoH <= response.status && response.status < threeH) {
      return response.json().then(function (json) {
        return Object.assign({}, omniFetchResponse, {body: json});
      });
    } else if (response.status === 404) {
      return Object.assign({}, omniFetchResponse, {body: undefined});
    } else {
      return response.text().then(function (text) {
        return Object.assign({}, omniFetchResponse, {body: text});
        // const err = Object.assign(new Error(response.statusText), omniFetchResponse, {body: text});
        // throw err;
      });
    }
  });
}
