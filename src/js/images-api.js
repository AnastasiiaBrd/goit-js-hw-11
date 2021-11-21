import axios from 'axios';

export default class ImagesApi {
  constructor() {
    this.inputSearchQueary = '';
    this.page = 1;
  }

  async fetchGallery() {
    const API_KEY = `24371628-8321d0b014cdaba49f6b000a8`;
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${this.inputSearchQueary}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    const response = await axios.get(url);
    this.incrementPage();
    console.log(response.data);
    return response;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.inputSearchQueary;
  }

  set query(newQuery) {
    return (this.inputSearchQueary = newQuery);
  }
}
