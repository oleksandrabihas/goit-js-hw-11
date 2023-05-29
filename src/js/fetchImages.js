import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
async function fetchImages(value, page) {
  try {
    const responce = await axios.get(
      `${BASE_URL}?key=36760227-fa8dd4880ed4c03c38b0c3c92&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    return responce.data;
  } catch (error) {
    console.log('Error', error.message);
    Notify.failure('Sorry, something went wrong');
  }
}
export {fetchImages}
