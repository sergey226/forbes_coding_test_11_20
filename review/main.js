/* @COMMENT 0. This review has been provided by S.Frolov on 11.11.2020.
 * The review evaluates code's architecture, approach, style and functionality.
 * Google's JavaScript style guide has been used in this evaluation:
 * https://google.github.io/styleguide/jsguide.html.
 */

 // @COMMENT 1. Great job on putting this code together in a short and sweet
 // form factor! I hope my comments will be helpfull and constructive for an
 // already pretty good looking piece of code. 

(function () {

  // @COMMENT 2. IIFE usage is ok, but it may be outdated. I'm not sure why and
  // in what context it is being used. Constants have a block scope,
  // so the IIFE closure is redundant. Similar scoping can be also achieved for
  // functions by using function expressions inside a block. IIFE is useful
  // for async anonymous functions, but this is not an async function.

  // @COMMENT 3. Consider modularizing the code below into modules, separating
  // data API functions from view presentation functions and related variables.

  // VARIABLES
  // @COMMENT 4. Technically, these are constants.-)

  // @COMMENT 5. It seems like an inconsistent usage of naming conventions. 
  // Consider renaming IMAGE_COUNT and PAGINATE_BY constants - 
  // e.g. imageCount and paginateBy.

  const IMAGE_COUNT = 50;
  const PAGINATE_BY = 10;

  // @COMMENT 6. Excellent practice of naming variables and functions: 
  // clear, self-descriptive and unambiguous.

  const dogBreedsList = document.querySelector('#dogBreedsList');
  const thumbnailContainerElement = document.querySelector(
    '#thumbnailContainerElement'
  );
  const dogBreedInput = document.querySelector('#dogBreedInput');
  const paginationElement = document.querySelector('#paginationElement');
  const imageModal = document.querySelector('#imageModal');
  const imageModalDisplay = document.querySelector('#imageModalDisplay');

  // API FUNCTIONS

  // @COMMENT 7. Consider organizing API functions in a separate module -
  // e.g. a "service" module and export it as needed. It will make the
  // code architecture more flexible and easier to refactor and grow.
  // Dog.ceo has other API calls, which could be added to such a module
  // without affecting main.js. Things like that are best to be done
  // from the start, in order to minimize subsequent refactoring.

  async function getDogBreeds() {
    // API call to dog.ceo
    // Returns all the possible breeds in a list

    // @COMMENT 8. Hardwiring literals into function calls is potentially
    // hazardous and generally inconvinient going forward.
    // Consider using a let or a const, e.g. "baseUrl" in fetch(baseUrl).
    // It makes the code more flexible and easier to expand.

    let response = await fetch('https://dog.ceo/api/breeds/list/all');

    // @COMMENT 9. Errors are not handled. Consider adding error handlers.
    // Some of them can be captured with try/catch blocks, others have to
    // be handled explicitly.

    let breeds = await response.json();
    return Object.keys(breeds.message);
  }

  async function getDogImages(breed, count) {
    // API call to dog.ceo
    // Returns a maximum count images in a list of a specific breed

    // @COMMENT 10. As noted before, I'm not sure if hardwiring literals 
    // into a function call is a good thing here.
    // Consider using a let, for example: let breedUrl = 
    // `https://dog.ceo/api/breed/${breed}/images/random/${count}`;
    // let response = await fetch(breedUrl);

    let response = await fetch(
      `https://dog.ceo/api/breed/${breed}/images/random/${count}`
    );
    let images = await response.json();

    // @COMMENT 11. Errors are not handled here too. One particular error is 
    // observed when an empty or non-existent breed is selected. This error 
    // may be handled, for example via:
    //
    // let message = response.ok ? images.message : [];
    // return message;
    //
    // Consider generalizing into a set of different common error handlers.

    return images.message;
  }

  // FUNCTIONS

  // @COMMENT 12. Consider organizing some or all of the view presentation 
  // functions below in a separate "view" module. It declutters the main 
  // module, makes it more lightweight and easier to read. The view may also
  // be structured as a class.

  async function setupDogBreedOptions() {
    // @COMMENT 13. Another minor note - an inconsistent comment placement 
    // inside functions. Consider moving up the comment below.

    const breeds = await getDogBreeds();
    // Calls API for list of breeds
    // Populates breeds into datalist for users to select from
    for (const breed of breeds) {
      const optionElement = document.createElement('option');
      optionElement.setAttribute('value', breed);
      dogBreedsList.appendChild(optionElement);
    }
  }

  function populateThumbnails(images, start) {
    // @COMMENT 14. Missing function description here and in
    // functions changeSelectedBreed, onDogBreedSelected and init.

    thumbnailContainerElement.innerHTML = '';

    for (const image of images.slice(start, start + PAGINATE_BY)) {
      const imageElement = document.createElement('div');
      imageElement.innerHTML = `<img src=${image}>`;
      thumbnailContainerElement.appendChild(imageElement);
      imageElement.addEventListener('click', function () {
        displayModal(image);
      });
    }
  }

  async function changeSelectedBreed(breed) {
    const images = await getDogImages(breed, IMAGE_COUNT);

    paginationElement.innerHTML = '';

    for (let pageNumber = 0; pageNumber < images.length / 10; pageNumber += 1) {

      // @COMMENT 15. Consider encapsulating the code inside this loop in
      // a separate helper function to make it more readable.

      const pageNumberElement = document.createElement('button');
      if (pageNumber === 0) {
        pageNumberElement.classList.add('active');
      }
      pageNumberElement.innerHTML = `${pageNumber + 1}`;
      pageNumberElement.addEventListener('click', function (event) {
        let oldActivePage = document.querySelector(
          '#paginationElement button.active'
        );
        if (oldActivePage) {
          oldActivePage.classList.remove('active');
        }
        event.target.classList.add('active');
        populateThumbnails(images, pageNumber * 10);
      });
      paginationElement.appendChild(pageNumberElement);
    }
    populateThumbnails(images, 0);
  }

  // @COMMENT 16. Functions displayModal and hideModal seem to belong
  // to "EVENT HANDLERS" section.

  function displayModal(image) {
    // Sets the src to the image URL that was passed and makes it visible
    imageModalDisplay.setAttribute('src', image);
    imageModal.style.visibility = 'visible';
  }

  function hideModal() {
    // returns modal to default view
    imageModal.style.visibility = 'hidden';
  }

  // EVENT HANDLERS

  function onDogBreedSelected(event) {
    const breed = event.target.value;
    changeSelectedBreed(breed);
  }

  // INIT

  // @COMMENT 17. Consider renaming the "init" function, e.g.
  // "initializeView" - a bit more descriptive. 

  function init() {
    setupDogBreedOptions();

    dogBreedInput.addEventListener('change', onDogBreedSelected);
    imageModal.addEventListener('click', hideModal);
  }

  init();
})();

// @COMMENT 18. In principle, this code can be decoulpled from the HTML
// document, by creating all needed elements inside JS. Then it will be
// possible to reuse it elsewhere in more complex scenarios with different
// HTML layouts and even frameworks. 

// @COMMENT 19. Consider using Cache API for storing responses and
// making the web page available offline and/or eliminating repetitive
// API requests.
