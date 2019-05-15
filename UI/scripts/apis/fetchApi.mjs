const token = localStorage.getItem('token');

/**
 * Makes a request to server and returns response object
 * @param {String} url - URL to fetch
 * @param {String} method - POST, GET, PATCH, OR DELETE
 * @param {Object} bodyObject - request body if neccessary
 * @returns {Object} res - fetch API response object
 */
export default function fetchApi(url, method, bodyObject) {
  const options = {
    method,
    body: JSON.stringify(bodyObject),
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    }),
  };

  return (
    fetch(url, options)
      .then(res => res.json())
      .then((res) => {
        if (res.data) return res.data;
        return undefined;
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log(err))
  );
}
