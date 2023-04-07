const heading = document.querySelector('h1');
const imgContainer = document.getElementById('img-container');
const loader = document.getElementById('loader');
const BackToTop = document.getElementById('back-to-top');

imgContainer.innerHTML = '';

let photosArr = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

// Unsplash API
let imageCount = 5;
let imageOrientation = 'portrait';
const apiKey = 'w2acEZ5xS4Po-MmlcKoK4TO68pdKg9glCoNIQnzr_h0';

// Image loading function
const imgLoaded = function () {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    loader.hidden = true;
    ready = true;
  }
};

// Helper functions to set attributes on DOM Elements
function setAttributes(el, att) {
  for (const key in att) {
    el.setAttribute(key, att[key]);
  }
}

// Create Elements for Links & Photos and add to DOM
const displayPhotos = function () {
  totalImages += photosArr.length;
  photosArr.forEach(photo => {
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.thumb,
      alt: photo.alt_description,
      title: photo.description ? photo.description : photo.alt_description,
    });

    item.appendChild(img);
    imgContainer.appendChild(item);
    img.addEventListener('load', imgLoaded);
  });
};

const errorElement = function (message) {
  const html = `<img class="error-image" src="./404-Illustration.png" alt="" />
  <div class="error-message">
    catch an error with code:${message} while loading images 😔😔
  </div>`;
  imgContainer.insertAdjacentHTML('beforeend', html);
  loader.hidden = true;
};
// Getphotos from unplash
const getPhotos = async function () {
  if (window.innerWidth >= 480) {
    imageOrientation = 'landscape';
  }
  let unsplashApi = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}&orientation=${imageOrientation}`;
  const response = await fetch(unsplashApi);
  if (!response.ok) {
    errorElement(response.status);
  }

  photosArr = await response.json();
  displayPhotos();

  //   Check to see if scroling near bottom of page, then load more Photos
  window.addEventListener('scroll', () => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1440 &&
      ready
    ) {
      imageCount = 20;
      ready = false;
      getPhotos();
    }
  });
};

getPhotos();

const ScrollToTop = function () {
  document.addEventListener('scroll', () => {
    window.scrollY > window.innerHeight
      ? BackToTop.classList.add('active')
      : BackToTop.classList.remove('active');
  });

  const headingHeight = heading.getBoundingClientRect().bottom;
  BackToTop.addEventListener('click', () => {
    window.scrollTo({
      top: headingHeight,
      behavior: 'smooth',
    });
  });
};

ScrollToTop();
