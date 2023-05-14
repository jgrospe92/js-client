let globalCounter = 0;
let resource_name = "films";
let baseUrl = window.location.protocol + "//" + window.location.hostname;
let current_page = 1;
let previous_page = -1;
let page_size = 10;

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
document.getElementById("searchBtnID").addEventListener("click", () => {
  disablePagination();
  clearData();
  const id = document.getElementById("search_id_input").value;
  var inputEl = document.getElementById("search_id_input");
  if (!validateID(id)) {
    alert("Id has to be valid positive number");
    return;
  }
  fetchFilmsById(id);
  inputEl.value = "";
});

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
 * @desc fetch films data from localhost/films-api
 * TODO add the url as a parameters
 */
const fetchFilms = async (page = 1, pageSize = 10, category = "") => {
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

  if (category) {
    newUrl = addQueries(uri, {
      page: page,
      pageSize: pageSize,
      category: category,
    });
  } else {
    newUrl = addQueries(uri, {
      page: page,
      pageSize: pageSize,
    });
  }
  // console.log(newUrl.href);
  const data = await getData(newUrl.href);
  // render pagination
  renderPagination(data);
  parsedData(data["data"], "films");
};

/**
 * @description return the previous page
 */
const goToPreviousPage = async () => {
  current_page--;
  fetchFilms(current_page, page_size);
};
document.getElementById("previous_btn").addEventListener("click", () => {
  goToPreviousPage();
});

/**
 * @description go to the next page
 */
const goToNextPage = async () => {
  current_page++;
  fetchFilms(current_page, page_size);
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
 * @desc Clears the table
 */
const clearData = () => {
  const tblEl = document.getElementById("tbl-body");
  tblEl.textContent = "";

  const counter = document.getElementById("data_count");
  counter.textContent = 0;
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

  if (resource_name == "films") {
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
    header += `
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Film title</th>
        <th>Description</th>
        <th>Category</th>
        <th>Name</th>
        <th>Release Year</th>
        `;
  } else {
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

    case "categories":
      break;
    case "actors":
      break;
  }

  const tblEl = document.getElementById("tbl-body");
  tblEl.innerHTML = rows;
  const counter = document.getElementById("data_count");
  globalCounter = data.length;
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
  switch (resource_name) {
    case "films":
      fetchFilms();
      break;
    case "categories":
      break;
    case "actors":
      break;
  }
});

/**
 * @description clears the table
 */
document.getElementById("clear_btn").onclick = clearData;

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
