/**
 * @description hides the create actor button
 */
const hideCreateActorBtn = () => {
  document.getElementById("create_actorBtn").style.display = "none";
};

/**
 * @description shows the create actor button
 */
const showCreateActorBtn = () => {
  document.getElementById("create_actorBtn").style.display = "block";
};

/**
 * @description hides the create actor button with the page loads
 */
window.addEventListener("load", hideCreateActorBtn());

/**
 * @description shows the categories select input
 */
const showCategorySelectContent = () => {
  removeActorFilmFilters();
  const filter_inputEl = document.getElementById("films_filters_parentInputID");
  let categorySelectContent = `
  <div class="col">
  <p class="my-2">Select Category: </p>
  <select id="select_categoryID" class="form-select my-2" aria-label="Default select example">
    <option selected value="-1">Category</option>
      <option value="1">Action</option>
      <option value="2">Animation</option>
      <option value="3">Children</option>
      <option value="4">Classics</option>
      <option value="5">Comedy</option>
      <option value="6">Documentary</option>
      <option value="7">Drama</option>
      <option value="8">Family</option>
      <option value="9">Foreign</option>
      <option value="10">Games</option>
      <option value="11">Horror</option>
      <option value="12">Music</option>
      <option value="13">New</option>
      <option value="14">Sci-Fi</option>
      <option value="15">Sports</option>
      <option value="16">Travel</option>
  </select>
</div>`;

  // Length and rating filter
  let ratingFilter = `
  <div class="col">
  <input id="rating_input_id" type="text" class="form-control my-2" placeholder="Enter Rating"
      aria-label="search_id_input ">
  </div>`;

  let filmFilters =
    `
  <div class="col">
  <input id="search_input" type="number" class="form-control my-2" placeholder="Enter film Length"
      aria-label="search_id_input ">
  </div>
  ` +
    ratingFilter +
    `
  <div class="col">
  <button type="button" id="searchBtnID" class="btn btn-primary my-2">Apply</button>
  </div>
  `;

  let filterParentEl = document.getElementById("search_film_parentInputID");
  filterParentEl.className = "row w-50";
  filterParentEl.innerHTML = filmFilters;

  filter_inputEl.innerHTML = categorySelectContent;

  buttonCallback();
};
/**
 * @desc removes the films filters
 */
const removeFilmsFilter = () => {
  const filter_inputEl = document.getElementById("films_filters_parentInputID");
  filter_inputEl.innerHTML = "";
  document.getElementById("search_film_parentInputID").innerHTML = "";
};

const addActorsFilter = () => {
  const filter_inputEl = document.getElementById("search_film_parentInputID");
  // filter film by category and rating
  let filtering = `
  <div class="row w-100">
  <div class="col">
  <input id="actor_id_input" type="number" class="form-control my-2" placeholder="Enter id"
      aria-label="actor_id_input">
  </div>
  <div class="col">
  <input id="rating_input_id" type="text" class="form-control my-2" placeholder="Enter Rating"
      aria-label="search_id_input">
  </div>
  <div class="col">
  <input type="text" id="categoryID" name="category" class="form-control my-2"
      placeholder="Enter Category" aria-label="Category">
</div>
<div class="col">
<button type="button" id="applyBtnID" class="btn btn-primary my-2">Apply</button>
</div>
</div>
  `;

  // first name and last filter
  let lastName = `<div class="col">
  <input id="actor_lastNameID" type="text" class="form-control my-2" placeholder="Enter Last name"
      aria-label="actor_firstNameID ">
  </div>`;

  let content =
    `
  <div class="col">
  <input id="actor_firstNameID" type="text" class="form-control my-2" placeholder="Enter First name"
      aria-label="search_id_input ">
  </div>
  ` +
    lastName +
    `
  <div class="col">
  <button type="button" id="search_actor_id" class="btn btn-primary my-2">Search Actor</button>
  </div>
  `;

  filter_inputEl.innerHTML = content;
  filter_inputEl.className = "row w-50";

  // append filter elements
  let filmFilterParentEl = document.createElement("div");
  filmFilterParentEl.id = "actor_film_filters_id";

  filmFilterParentEl.innerHTML = filtering;
  filter_inputEl.insertAdjacentElement("afterend", filmFilterParentEl);

  instantiateSearchActor();
  instantiateApplyButton();
};

/**
 * @desc shows the films filters
 */
const showFilmsFilter = () => {
  removeActorFilmFilters();
  const filter_inputEl = document.getElementById("films_filters_parentInputID");
  let content = `<div class="col">
  <select id="select_languageID" class="form-select my-2" aria-label="Default select example">
      <option selected>Language</option>
      <option value="English">English</option>
      <option value="Italian">Italian</option>
      <option value="Japanese">Japanese</option>
      <option value="Mandarin">Mandarin</option>
      <option value="French">French</option>
      <option value="German">German</option>
  </select>
</div>
<div class="col">
  <input type="text" id="categoryID" name="category" class="form-control my-2"
      placeholder="Enter Category" aria-label="Category">
</div>
<div class="col">
  <input type="text" id="titleID" name="title" class="form-control my-2" placeholder="Enter Title"
      aria-label="title">
</div>
<div class="col">
  <input type="text" id="descriptionID" name="description" class="form-control my-2"
      placeholder="Enter description" aria-label="description">
</div>
<div class="col">
  <button type="button" id="applyBtnID" class="btn btn-primary my-2">Apply</button>
</div>`;
  filter_inputEl.innerHTML = content;

  let searchByFilmParentContent = `<div class="col">
  <input id="search_input" type="number" class="form-control my-2" placeholder="search film id "
      aria-label="Film id">
</div>
<div class="col">
  <button type="button" id="searchBtnID" class="btn btn-primary my-2">Search film</button>
</div>`;
  document.getElementById("search_film_parentInputID").className = "row w-25";
  document.getElementById("search_film_parentInputID").innerHTML =
    searchByFilmParentContent;

  buttonCallback();
  instantiateApplyButton();
};

const removeActorFilmFilters = () => {
  const parentEl = document.getElementById("actor_film_filters_id");
  if (parentEl) {
    parentEl.remove();
  }
};

const resetFilmsFilter = () => {
  document.getElementById("select_languageID").value = "Language";
  document.getElementById("categoryID").value = "";
  document.getElementById("titleID").value = "";
  document.getElementById("descriptionID").value = "";
};
