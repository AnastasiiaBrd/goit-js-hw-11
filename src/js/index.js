import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApi from './images-api';
import imagesCardGallery from '../imagesCard.hbs';
import LoadMoreBtn from './load-more-btn';

const formEl = document.querySelector(`.search-form`);
const galleryBox = document.querySelector(`.gallery`);

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionPosition: 'bottom',
  captionDelay: 250,
});

const loadMoreBtn = new LoadMoreBtn({
  selector: `.load-more`,
  hidden: true,
});
const imagesApi = new ImagesApi();

function onSearch(e) {
  clearImageBox();
  e.preventDefault();
  imagesApi.query = e.currentTarget.elements.searchQuery.value;
  imagesApi.resetPage();
  imagesApi.fetchGallery().then(data => {
    if (data.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else {
      appendImagesMarkup(data);
      loadMoreBtn.show();
    }
  });

  imagesApi.resetPage();
  clearImageBox();
}
function onLoadMore() {
  loadMoreBtn.disable();
  imagesApi
    .fetchGallery()
    .then(hits => {
      appendImagesMarkup(hits);
      loadMoreBtn.enable();
      return hits;
    })
    .then(hits => {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      return hits;
    })
    .then(hits => {
      console.log(hits);
      if (hits.length < 40) {
        loadMoreBtn.hide();
        Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
      }
    });
}
function clearImageBox() {
  galleryBox.innerHTML = ``;
}
function appendImagesMarkup(hits) {
  galleryBox.insertAdjacentHTML(`beforeend`, imagesCardGallery(hits));
  lightbox.refresh();
}

loadMoreBtn.refs.button.addEventListener(`click`, onLoadMore);
formEl.addEventListener('submit', onSearch);
