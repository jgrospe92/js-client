let globalCounter = 0;

/**
 * @desc fetch shows data from the https://api.tvmaze.com/show APi
 */
const fetchShows = async () => {
    const uri = 'https://api.tvmaze.com/shows';
    const data = await getData(uri);
    parsedData(data);
   
}

/**
 * @desc Clears the table
 */
const clearData = () => {
    const tblEl = document.getElementById('tbl-body');
    tblEl.textContent = "";

    const counter = document.getElementById('data_count');
    counter.textContent = 0;
}

const changeTable = (resource_name) => {
    let header = '';

    if (resource_name == "films")
    {
        header +=
        `
        <th>Title</th>
        <th>Description</th>
        <th>Language</th>
        <th>Category</th>
        <th>Actor</th>
        <th>Release Year</th>
        `
    } else if (resource_name == "actors")
    {
        header += 
        `
        <th>Actor</th>
        <th>Language</th>
        <th>Genres</th>
        <th>Premiered</th>
        <th>Rating</th>
        <th>Status</th>
        ` 
    }

    const tblHeader = document.getElementById('tbl_header');
    tblHeader.innerHTML = header;
}


/**
 * @desc Creates html representation of the response object
 * @param {object} data - The response object
 */
const parsedData = (data, resource_name) => {
    let rows = '';
   
    if (resource_name == "films"){

        data.forEach(data => {
            rows += 
            `
            <tr>
            <td>${data.name}</td>
            <td>${data.language}</td>
            <td>${data.genres.join(", ")}</td>
            <td>${data.premiered}</td>
            <td>${data.rating.average}</td>
            <td>${data.status}</td>
            </tr>
            `
        });

    }

    const tblEl = document.getElementById('tbl-body');
    tblEl.innerHTML = rows;
    const counter = document.getElementById('data_count');
    globalCounter = data.length
    counter.innerHTML = globalCounter;
}

const displayErr = () => {
    const tblEl = document.getElementById('tbl-body');
    tblEl.innerHTML = "<b> something went wrong with your request </b>";
}

/**
 * @desc Implements http client using fetch APi
 * @param {string} url - The URl to where to fetch the data 
 * @returns {object} - The responses data
 */
const getData = async (url) => {
     // STEP 1 - Configure the request header
     let response = null;
     const httpHeaders = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    const reqHeaders = new Headers(httpHeaders);
    // STEP 2 - Create and init an HTTP request : GET | POST | DELETE
    const request = new Request({
        method: "POST",
        headers: reqHeaders,
        //url : uri
      }); 

    // STEP 3 - Now we can send the request using the fetch APi
    try {
        response = await fetch(url, request);
        if (response.status == 200){
            const data = await response.json();
            return data;
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * @desc remove a single item in the table
 * @param {object} e - The source of the event
 */
function removeItem(e){
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
    const counter = document.getElementById('data_count');
    counter.innerHTML = --globalCounter;
}

// add the function to the event using event listeners
// let btn_el = document.getElementById('shows_btn_id');
// btn_el.addEventListener('click', function(){fetchShows();}, false);

// traditional DOM way
document.getElementById('shows_btn_id').onclick = fetchShows;
document.getElementById('clear_btn').onclick = clearData;
document.getElementById('resource_name').addEventListener('change', (e) => {
    let resource_name = e.target.value;
    changeTable(resource_name);
})

// event delegation
document.getElementById('tbl-body').addEventListener('click', function(e){removeItem(e);},false);