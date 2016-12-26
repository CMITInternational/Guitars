import promiseRetry from 'promise-retry';

var createHeadersFromContentTypeDesc = (contentTypeDesc) => {
  switch (contentTypeDesc) {
    case 'form': return {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'};
    case 'json': return {'Accept': 'application/json', 'Content-type': 'application/json'};
  }
  return '';
};

export default function omniPost (URL, params, contentTypeDesc?: string = 'form') {
  let twoH = 200;
  let threeH = 300;

  let headers = createHeadersFromContentTypeDesc(contentTypeDesc);

  return promiseRetry((retry) => {
    return fetch(URL, {
      method: 'post',
      mode: 'cors',
      credentials: 'include',
      headers: headers,
      body: params
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
        const err = Object.assign(new Error(response.statusText), omniFetchResponse, {body: text});
        throw err;
      });
    }
  });
}
