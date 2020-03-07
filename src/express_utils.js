
const getReq = async endpoint => {
  const response = await fetch(endpoint);
  const body = await response.json();
  return body;
};

const postReq = async (endpoint, obj) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  });
  const body = await response.json();
  return body;
};

export default {get: getReq, post: postReq}
