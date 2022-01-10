import { API_URL } from '../constants';

export function getPrediction(file, fishType) {
    const body = new FormData();
    body.append('images', file);
    body.append('fishType', fishType);
    return fetch (/*API_URL +*/  '/predict', {
      method: 'POST',
      body: body
    }).then(data => data.json())
    //.catch(error => console.log(error));
}
