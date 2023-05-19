/**
 * @description global variables
 */
let globalCounter = 0;
let resource_name = "films";
let baseUrl = window.location.protocol + "//" + window.location.hostname;
let current_page = 1;
let previous_page = -1;
let page_size = 10;
let filtersMap = new Map();
let selectCategoryId = "";

/**
 * @description renders the pagination
 * @param {Response} obj
 */
const renderPagination = (obj) => {
  const prevBtn = document.getElementById("previous_btn");
  const nextBtn = document.getElementById("next_btn");

  if (obj.current_page == 1) {
    prevBtn.style.pointerEvents = "none";
    prevBtn.classList.add("disabled");
    nextBtn.classList.remove("disabled");
    nextBtn.style.pointerEvents = "";
  } else if (obj.current_page == obj.last_page) {
    nextBtn.classList.add("disabled");
  } else {
    prevBtn.style.pointerEvents = "";
    nextBtn.classList.remove("disabled");
    prevBtn.classList.remove("disabled");
  }
};

/**
 * @description function to disable pagination
 */
const disablePagination = () => {
  const prevBtn = document.getElementById("previous_btn");
  const nextBtn = document.getElementById("next_btn");
  prevBtn.style.pointerEvents = "none";
  prevBtn.classList.add("disabled");
  nextBtn.classList.add("disabled");
  nextBtn.style.pointerEvents = "none";
};

/**
 * @description event handler for searching specific film
 */
const buttonCallback = () => {
  document.getElementById("searchBtnID").addEventListener("click", () => {
    disablePagination();
    let inputEl = document.getElementById("search_input");
    if (resource_name == "films") {
      const id = inputEl.value;
      if (!validateID(id)) {
        alert("Id has to be valid positive number");
        return;
      }
      console.log("search film id");
      fetchFilmsById(id);
      inputEl.value = "";
    } else if (resource_name == "categories") {
      if (selectCategoryId == "" || selectCategoryId < 0) {
        alert("Please select a category");
        return;
      }

      const ratingParentEl = document.getElementById("rating_input_id");
      let ratingValue = sanitizeInput(ratingParentEl.value);
      let film_length = inputEl.value;
      if (!validateID(film_length)) {
        if (film_length.length > 0) {
          alert("Invalid film length");
          return;
        }
      }
      filtersMap.set("film_length", film_length);
      filtersMap.set("rating", ratingValue);
      fetchFilmsByCategory(selectCategoryId, filtersMap);
    }
  });
};
// callback
buttonCallback();

/**
 *
 * @param {string} id
 * @returns boolean
 * @description validate if the id is a valid number and positive
 */
const validateID = (id) => {
  id = id.trim();
  if (!id) {
    return false;
  }
  id = id.replace(/^0+/, "") || "0";
  var n = Math.floor(Number(id));
  return n !== Infinity && String(n) === id && n >= 0;
};

/**
 *  @description fetch a specific film using the id
 * @param {string} id
 */
const fetchFilmsById = async (id) => {
  let uri = new URL("films-api/films/" + id, baseUrl);

  const myInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const request = new Request(uri, myInit);
  try {
    response = await fetch(request);
    if (response.ok) {
      FilmTableByID("filmsByID");
      const data = await response.json();
      parsedData(data, "filmsByID");
    } else {
      alert("resource not found");
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description fetch actors
 * @param {Map} filterObj
 */
const fetchActors = async (filterObj = new Map()) => {
  // create a url
  let uri = new URL("films-api/actors", baseUrl);
  // create new uri
  const addQueries = (url, params = {}) =>
    new URL(
      `${url.origin}${url.pathname}?${new URLSearchParams([
        ...Array.from(url.searchParams.entries()),
        ...Object.entries(params),
      ])}`
    );

  var newUrl = NaN;

  if (filterObj.length !== 0) {
    firstNameFilter = filterObj.has("first_name")
      ? filterObj.get("first_name")
      : "";
    lastNameFilter = filterObj.has("last_name")
      ? filterObj.get("last_name")
      : "";
    titleFilter = filterObj.has("title") ? filterObj.get("title") : "";
    descriptionFilter = filterObj.has("description")
      ? filterObj.get("description")
      : "";
    newUrl = addQueries(uri, {
      first_name: firstNameFilter,
      last_name: lastNameFilter,
    });
  } else {
    newUrl = addQueries(uri, {
      page: page,
      pageSize: pageSize,
    });
  }

  const data = await getData(newUrl.href);

  if (!data) {
    alert("resource does not exists");
    clearData();
  }
  // render pagination
  disablePagination();
  parsedData(data, "actors");
};

/**
 * @desc fetch films data from localhost/films-api
 * TODO add the url as a parameters
 */
const fetchFilms = async (page = 1, pageSize = 10, filterObj = new Map()) => {
  // create a url
  let uri = new URL("films-api/films", baseUrl);
  // create new uri
  const addQueries = (url, params = {}) =>
    new URL(
      `${url.origin}${url.pathname}?${new URLSearchParams([
        ...Array.from(url.searchParams.entries()),
        ...Object.entries(params),
      ])}`
    );

  var newUrl = NaN;

  if (filterObj.length !== 0) {
    languageFilter = filterObj.has("language") ? filterObj.get("language") : "";
    categoryFilter = filterObj.has("category") ? filterObj.get("category") : "";
    titleFilter = filterObj.has("title") ? filterObj.get("title") : "";
    descriptionFilter = filterObj.has("description")
      ? filterObj.get("description")
      : "";
    newUrl = addQueries(uri, {
      page: page,
      pageSize: pageSize,
      language: languageFilter,
      category: categoryFilter,
      title: titleFilter,
      description: descriptionFilter,
    });
  } else {
    newUrl = addQueries(uri, {
      page: page,
      pageSize: pageSize,
    });
  }
  // console.log(newUrl.href);
  const data = await getData(newUrl.href);

  if (!data) {
    alert("resource does not exists");
    clearData();
  }
  // render pagination
  renderPagination(data);
  parsedData(data["data"], "films");
};

/**
 * @desc fetch films data from localhost/films-api/categories/id/films
 *
 */
const fetchFilmsByCategory = async (categoryId, filterObj = new Map()) => {
  // create a url
  let uri = new URL("films-api/categories/" + categoryId + "/films", baseUrl);
  // create new uri
  const addQueries = (url, params = {}) =>
    new URL(
      `${url.origin}${url.pathname}?${new URLSearchParams([
        ...Array.from(url.searchParams.entries()),
        ...Object.entries(params),
      ])}`
    );

  var newUrl = NaN;
  console.log(filterObj);
  if (filterObj.length !== 0) {
    film_lengthFilter = filterObj.has("film_length")
      ? filterObj.get("film_length")
      : "";

    ratingFilter = filterObj.has("rating") ? filterObj.get("rating") : "";
    newUrl = addQueries(uri, {
      film_length: film_lengthFilter,
      rating: ratingFilter,
    });
  } else {
    newUrl = addQueries(uri, {});
  }
  const data = await getData(newUrl.href);

  if (data.films.data.length == 0) {
    alert("resource does not exists");
    clearData();
  }
  parsedData(data, "categories");
};

/**
 * @description return the previous page
 */
const goToPreviousPage = async () => {
  current_page--;
  if (resource_name == "films") {
    fetchFilms(current_page, page_size, filtersMap);
  } else if (resource_name == "categories") {
    alert("previous button clicked");
  }
};
document.getElementById("previous_btn").addEventListener("click", () => {
  goToPreviousPage();
});

/**
 * @description go to the next page
 */
const goToNextPage = async () => {
  current_page++;
  if (resource_name == "films") {
    fetchFilms(current_page, page_size, filtersMap);
  } else if (resource_name == "categories") {
    alert("next button clicked");
  }
};
document.getElementById("next_btn").addEventListener("click", () => {
  goToNextPage();
});

/**
 *
 * @param {String} input
 * @returns {String} input
 * @desc sanitize user inputs
 */
const sanitizeInput = (input) => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * @desc Clears the table / forms
 */
const clearData = () => {
  filtersMap.clear();
  disablePagination();
  const tblEl = document.getElementById("tbl-body");
  tblEl.textContent = "";

  const counter = document.getElementById("data_count");
  counter.textContent = 0;

  const selectCategoryParentEl = document.getElementById("select_categoryID");
  if (selectCategoryParentEl) {
    selectCategoryParentEl.value = "-1";
  }
  if (resource_name == "categories") {
    const rating = document.getElementById("rating_input_id");
    const filmLength = document.getElementById("search_input");
    if (rating) {
      rating.value = "";
    }
    if (filmLength) {
      filmLength.value = "";
    }
  }
  if (resource_name == "actors") {
    const first_name = document.getElementById("actor_firstNameID");
    const last_name = document.getElementById("actor_lastNameID");
    if (first_name) {
      first_name.value = "";
    }
    if (last_name) {
      last_name.value = "";
    }
  }
};

/**
 *
 * @param {string} resource_name
 * @description change table header based on the resource_name
 */

/**
 *
 * @param {string} resource_name
 * @description change table header for search film by ID
 */
const FilmTableByID = (resource_name) => {
  let header = "";
  if (resource_name == "filmsByID") {
    header += `
        <th>#</th>
        <th>Title</th>
        <th>Release year</th>
        <th>Rental rate</th>
        <th>Replacement cost</th>
        <th>Rating</th>
        <th>Length</th>
        `;
  } else {
    header += `
    <th>#</th>
    <th>Title</th>
    <th>Description</th>
    <th>Language</th>
    <th>Category</th>
    <th>Actor</th>
    <th>Release Year</th>
    `;
  }
  const tblHeader = document.getElementById("tbl_header");
  tblHeader.innerHTML = header;
};

/**
 * @description change table header base on the resource name
 * @param {string} resource_name
 */
const changeTable = (resource_name) => {
  let header = "";
  filtersMap.clear();

  if (resource_name == "films") {
    hideCreateActorBtn();
    showFilmsFilter();
    header += `
        <th>#</th>
        <th>Title</th>
        <th>Description</th>
        <th>Language</th>
        <th>Category</th>
        <th>Actor</th>
        <th>Release Year</th>
        `;
  } else if (resource_name == "actors") {
    showCreateActorBtn();
    removeFilmsFilter();
    addActorsFilter();
    header += `
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        `;
  } else {
    hideCreateActorBtn();
    removeFilmsFilter();
    showCategorySelectContent();
    categoryCallback();
    header += `
        <th>#</th>
        <th>Category</th>
        <th>Film Title</th>
        <th>Description</th>
        <th>Length</th>
        <th>Rating</th>
        <th>Release Year</th>
        `;
  }

  const tblHeader = document.getElementById("tbl_header");
  tblHeader.innerHTML = header;
};

/**
 * @desc Creates html representation of the response object
 * @param {object} data - The response object
 */
const parsedData = (data, resource_name) => {
  let rows = "";
  let item_counter = 1;
  switch (resource_name) {
    case "films":
      data.forEach((data) => {
        rows += `
            <tr id='row_data'>
              <td>${data.film_id}</td>
              <td>${data.title}</td>
              <td>${data.description}</td>
              <td>${data.language}</td>
              <td>${data.category}</td>
              <td>${data.actor.first_name} ${data.actor.last_name}</td>
              <td>${data.release_year}</td>
            </tr>
            `;
      });
      break;
    case "filmsByID":
      data.forEach((data) => {
        rows += `
            <tr id='row_data'>
              <td>${data.film_id}</td>
              <td>${data.title}</td>
              <td>${data.release_year}</td>
              <td>$${data.rental_rate}</td>
              <td>$${data.replacement_cost}</td>
              <td>${data.rating}</td>
              <td>${data.length}</td>
            </tr>
            `;
      });
      break;
    case "actors":
      data.forEach((data) => {
        rows += `
              <tr id='row_data'>
                <td>${data.actor_id}</td>
                <td>${data.first_name}</td>
                <td>${data.last_name}</td>
              </tr>
              `;
      });
      break;

    case "categories":
      data.films.data.forEach((value) => {
        rows += `
            <tr id='row_data'>
              <td>${value.film_id}</td>
              <td>${data.category.name}</td>
              <td>${value.title}</td>
              <td>${value.description}</td>
              <td>${value.length}</td>
              <td>${value.rating}</td>
              <td>${value.release_year}</td>
            </tr>
            `;
      });
      break;
  }

  const tblEl = document.getElementById("tbl-body");
  tblEl.innerHTML = rows;
  const counter = document.getElementById("data_count");
  globalCounter = data.length;
  if (resource_name == "categories") {
    globalCounter = data.films.count;
  }
  counter.innerHTML = globalCounter;
};

/**
 * @desc display error message
 */
const displayErr = (message) => {
  const tblEl = document.getElementById("tbl-body");
  tblEl.innerHTML = message;
};

/**
 * @desc Implements http client using fetch APi
 * @param {string} url - The URl to where to fetch the data
 * @returns {object} - The responses data
 */
const getData = async (url) => {
  // STEP 1 - Configure the request header
  let response = null;
  // STEP 2 - Create and init an HTTP request : GET | POST | DELETE
  const myInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  const request = new Request(url, myInit);

  // STEP 3 - Now we can send the request using the fetch APi
  try {
    response = await fetch(request);

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * @desc update the counter badge when item is removed
 */
const updateItemCounter = () => {
  const counter = document.getElementById("data_count");
  counter.innerHTML = --globalCounter;
};

// add the function to the event using event listeners
// let btn_el = document.getElementById('shows_btn_id');
// btn_el.addEventListener('click', function(){fetchShows();}, false);
// traditional DOM way

/**
 * @param {string} resource name
 * @description fetch films based on the selected resource name
 */
document.getElementById("shows_btn_id").addEventListener("click", () => {
  filtersMap.clear();
  switch (resource_name) {
    case "films":
      fetchFilms();
      break;
    case "categories":
      const categoryId = document.getElementById("select_categoryID").value;
      if (categoryId > 0) {
        fetchFilmsByCategory(selectCategoryId);
      } else {
        alert("Please select a category");
      }
      break;
    case "actors":
      fetchActors();
      break;
  }
});

/**
 * @description clears the table
 */
document.getElementById("clear_btn").addEventListener("click", () => {
  clearData();
  if (resource_name == "films") {
    resetFilmsFilter();
  }
});

/**
 * @param {object} takes an html object
 * @description change the table header based on the resource name
 */
document.getElementById("resource_name").addEventListener("change", (e) => {
  resource_name = e.target.value;
  clearData();
  changeTable(resource_name);
});

/**
 * @param {object} takes an html object
 * @description removes the selected li element
 */
document.getElementById("tbl-body").addEventListener(
  "click",
  function (e) {
    removeItem(e);
  },
  false
);

/**
 * @desc Clears the form inputs
 */
document.getElementById("clear_form").addEventListener(
  "click",
  function (e) {
    resetForm();
  },
  false
);

/**
 * @description function to clear the form inputs
 *
 */
const resetForm = () => {
  var form = document.getElementById("actor_form");
  form.reset();
};

const instantiateSearchActor = () => {
  document.getElementById("search_actor_id").addEventListener("click", () => {
    const first_name = document.getElementById("actor_firstNameID").value;
    const last_name = document.getElementById("actor_lastNameID").value;
    console.log(first_name + " " + last_name);

    if (!first_name && !last_name) {
      alert("Please provide at least the first name or last name");
      return;
    }
    if (first_name) {
      filtersMap.set("first_name", first_name);
    }
    if (last_name) {
      filtersMap.set("last_name", last_name);
    }

    fetchActors(filtersMap);
  });
};

/**
 * @description applies resource filtering on films
 */
const instantiateApplyButton = () => {
  document.getElementById("applyBtnID").addEventListener("click", () => {
    const languageValue = document.getElementById("select_languageID").value;
    const categoryValue = document.getElementById("categoryID").value;
    const titleValue = document.getElementById("titleID").value;
    const descriptionValue = document.getElementById("descriptionID").value;
    console.log("films apply filter");
    if (languageValue !== "Language") {
      filtersMap.set("language", languageValue);
    }
    if (categoryValue.length != 0) {
      filtersMap.set("category", categoryValue);
    }
    if (titleValue.length != 0) {
      filtersMap.set("title", titleValue);
    }
    if (descriptionValue.length != 0) {
      filtersMap.set("description", descriptionValue);
    }
    fetchFilms(1, 10, filtersMap);
  });
};
/**
 * @description initial callback function
 */
instantiateApplyButton();

/**
 * @description callback for select category
 */
const categoryCallback = () => {
  document
    .getElementById("select_categoryID")
    .addEventListener("change", (e) => {
      selectCategoryId = e.target.value;
    });
};
