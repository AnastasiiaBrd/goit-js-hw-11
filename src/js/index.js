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

let imagesCount = 0;

async function onSearch(e) {
  clearImageBox();
  e.preventDefault();
  imagesApi.query = e.currentTarget.elements.searchQuery.value;
  imagesApi.resetPage();
  imagesCount = 0;
  addImages();
  loadMoreBtn.show();
  clearImageBox();
}
async function onLoadMore() {
  loadMoreBtn.disable();
  await addImages();
  loadMoreBtn.enable();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
function clearImageBox() {
  galleryBox.innerHTML = ``;
}
async function appendImagesMarkup(hits) {
  galleryBox.insertAdjacentHTML(`beforeend`, imagesCardGallery(await hits));
  lightbox.refresh();
}

async function addImages() {
  const images = await imagesApi.fetchGallery();
  imagesCount += images.data.hits.length;
  if (images.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  } else if (imagesCount >= images.data.totalHits) {
    loadMoreBtn.hide();
    Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
  }
  appendImagesMarkup(images.data.hits);

  return images;
}

loadMoreBtn.refs.button.addEventListener(`click`, onLoadMore);
formEl.addEventListener('submit', onSearch);
