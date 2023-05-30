import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs';
import { fetchImages } from './fetchImages';
import { renderCards } from './renderCards';
import { smoothScroll } from './smoothScroll';

let page = 1;

refs.form.addEventListener('submit', handlerSearchImage);

// -------LOAD MORE------//

// async function handlerSearchImage(ev) {
//   ev.preventDefault();
//   refs.gallery.innerHTML = '';
//   const value = refs.input.value.trim();
//   if (value === '') {
//     refs.loadMoreBtn.style.display = 'none';
//     return;
//   } else {
//     const arrayResponse = await fetchImages(value, page);
//     if (arrayResponse.hits.length === 0) {
//       refs.loadMoreBtn.style.display = 'none';
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       const totalPages = arrayResponse.totalHits;
//       const arrayData = arrayResponse.hits;
//       Notify.success(`Hooray, we found ${totalPages} images`);
//       renderGallery(arrayData, totalPages);

//     }
//   }
// }

// function renderGallery(galleryArray, totalPages) {
//   refs.gallery.innerHTML += renderCards(galleryArray);
//   const lightbox = new SimpleLightbox('.gallery a');
//   lightbox.refresh();
//   buttonVisibility(totalPages);
// }

// function buttonVisibility(totalPages) {
//   if (Math.ceil(totalPages / 40) === page) {
//     refs.loadMoreBtn.style.display = 'none';
//     Notify.info("We're sorry, but you've reached the end of search results.");
//   } else {
//     refs.loadMoreBtn.style.display = 'block';
//   }
// }

// refs.loadMoreBtn.addEventListener('click', handlerPagination);
// async function handlerPagination() {
//   page += 1;
//   const value = refs.input.value.trim();
//   const arrayResponse = await fetchImages(value, page);
//   const totalPages = arrayResponse.totalHits;
//   renderGallery(arrayResponse.hits, totalPages);
//   smoothScroll();
// }

// -------OBSERVER----- //

let options = {
  root: null,
  rootMargin: '400px',
  threshold: 0,
};

const observer = new IntersectionObserver(handleIntersect, options);
const target = document.querySelector('.guard');
observer.observe(target);

function handleIntersect(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      page += 1;
      const value = refs.input.value.trim();
      if (value === '') {
        return;
      }
      try {
        const arrayResponse = await fetchImages(value, page);
        const totalPages = arrayResponse.totalHits;
        renderGallery(arrayResponse.hits, totalPages);
      } catch (error) {
        console.log('Error', error.message);
        Notify.failure('Sorry, something went wrong');
      }
    }
  });
}

async function handlerSearchImage(ev) {
  ev.preventDefault();
  refs.gallery.innerHTML = '';
  const value = refs.input.value.trim();
  if (value === '') {
    return;
  } else {
    const arrayResponse = await fetchImages(value, page);
    if (arrayResponse.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      const totalPages = arrayResponse.totalHits;
      const arrayData = arrayResponse.hits;
      Notify.success(`Hooray, we found ${totalPages} images`);
      renderGallery(arrayData, totalPages);
    }
  }
}
function renderGallery(galleryArray, totalPages) {
  refs.gallery.innerHTML += renderCards(galleryArray);
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
  target.style.display = 'block';
  if (Math.ceil(totalPages / 40) === page) {
    observer.unobserve(target);
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
