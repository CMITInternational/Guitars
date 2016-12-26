import promiseRetry from 'promise-retry';

export default function omniFetchFile (URL) {
  let twoH = 200;
  let threeH = 300;
  return promiseRetry((retry) => {
    return fetch(URL, {
      mode: 'cors',
      credentials: 'include'
    }).catch(retry);
  }, {
    retries: 5
  }).then((response) => {
    const omniFetchFileResponse = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
    if (twoH <= response.status && response.status < threeH) {
      return response.blob().then(function (blob) {
        return blob;
      });
    } else if (response.status === 404) {
      return Object.assign({}, omniFetchFileResponse, {body: undefined});
    } else {
      return response.text().then(function (text) {
        const err = Object.assign(new Error(response.statusText), omniFetchFileResponse, {body: text});
        throw err;
      });
    }
  });
}
