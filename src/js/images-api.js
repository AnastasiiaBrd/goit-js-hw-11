// import { get, set } from "lodash";

export default class ImagesApi {
  constructor() {
    this.inputSearchQueary = '';
    this.page = 1;
  }

  fetchGallery() {
    // console.log(this);
    const API_KEY = `24371628-8321d0b014cdaba49f6b000a8`;
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${this.inputSearchQueary}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        this.incrementPage();
        // console.log(data.hits);
        return data.hits;
      });
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
