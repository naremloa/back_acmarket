import Cookies from 'js-cookie';

export function setCookie(name, value, setting) {
  return !!Cookies.set(name, value, setting);
}

export function getCookie(name) {
  const cookie = Cookies.getJSON(name);
  let res = null;
  try {
    res = cookie !== undefined ? JSON.parse(cookie) : cookie;
  } catch (error) {
    res = cookie;
  }
  return res;
}

export function removeCookie(name) {
  Cookies.remove(name);
  return getCookie(name) === undefined;
}
