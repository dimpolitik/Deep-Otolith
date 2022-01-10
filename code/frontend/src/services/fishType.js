import { API_URL } from '../constants';

export function getFishType() {
  return fetch(/*API_URL +*/ '/fishtype')
    .then(data => data.json())
    //.catch(error => console.log(error));
}
