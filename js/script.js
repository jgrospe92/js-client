let globalCounter = 0;
let resource_name = "films";
let baseUrl = window.location.protocol + "//" + window.location.hostname;

/**
 * @desc global variables
 */
const submitBtn = document.getElementById("submitBtn");

/**
 * @desc fetch shows data from the https://api.tvmaze.com/show APi
 */
const fetchShows = async () => {
  const uri = "https://api.tvmaze.com/shows";
  const data = await getData(uri);
  parsedData(data);
};

/**
 * @desc fetch films data from localhost/films-api
 */

const fetchFilms = async () => {
  // create a url
  let uri = new URL("films-api/films", baseUrl);
  // let currentParams = new URLSearchParams(uri.search);
  // set the params
  // currentParams.append("page", 1);
  // currentParams.append("pageSize", 2);

  // create new uri
  const addQueries = (url, params = {}) =>
    new URL(
      `${url.origin}${url.pathname}?${new URLSearchParams([
        ...Array.from(url.searchParams.entries()),
        ...Object.entries(params),
      ])}`
    );

  // console.log(currentParams.toString());

  const newUrl = addQueries(uri, { page: 1, pageSize: 10, category: "horror" });
  // console.log(newUrl.href);
  const data = await getData(newUrl.href);
  parsedData(data["data"], "films");
};

/**
 * @param {object} htmlElement object
 * @description validate and processes form data
 */
submitBtn.addEventListener("click", (e) => {
  "use strict";
  handleCreateActor(e);
});

/**
 * @description
 * @returns None
 */
const handleCreateActor = async (e) => {
  const form = document.getElementById("actor_form");
  let uri = new URL("films-api/actors", baseUrl);
  var myModalEl = document.getElementById("staticBackdrop");
  var modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
  const fname = sanitizeInput(document.getElementById("first_name").value);
  const lname = sanitizeInput(document.getElementById("last_name").value);

  if (!fname || !lname) {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
    return;
  }

  var bodyReq = JSON.stringify([{ first_name: fname, last_name: lname }]);
  console.log(bodyReq);
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: bodyReq,
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
  } catch (error) {
    console.error(error);
  }
  modal.hide();
  resetForm();
};

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
            <tr>
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
const displayErr = () => {
  const tblEl = document.getElementById("tbl-body");
  tblEl.innerHTML = "<b> something went wrong with your request </b>";
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
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * @desc remove a single item in the table
 * @param {object} e - The source of the event
 */
function removeItem(e) {
  let target, elParent, elGrandParent;
  target = e.target || e.srcElement;
  elParent = target.parentNode;
  elGrandParent = elParent.parentNode;
  elGrandParent.removeChild(elParent);
  updateItemCounter();
}
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
