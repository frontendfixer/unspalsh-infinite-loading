const imgContainer = document.getElementById('img-container');
const loader = document.getElementById('loader');
imgContainer.innerHTML = '';

let imageCount = 20;
let photosArr = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

// Unsplash API
const apiKey = 'w2acEZ5xS4Po-MmlcKoK4TO68pdKg9glCoNIQnzr_h0';
let unsplashApi = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}&orientation=landscape`;

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
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.description ? photo.description : photo.alt_description,
    });

    item.appendChild(img);
    imgContainer.appendChild(item);
    img.addEventListener('load', imgLoaded);
    imageCount = 30;
  });
};

// Getphotos from unplash
const getPhotos = async function () {
  try {
    const response = await fetch(unsplashApi);
    photosArr = await response.json();
    displayPhotos();
  } catch (err) {
    console.error(err);
  }
  //   Check to see if scroling near bottom of page, then load more Photos
  window.addEventListener('scroll', () => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1440 &&
      ready
    ) {
      ready = false;
      getPhotos();
    }
  });
};

getPhotos();
