async function fetchShows(){
    const uri = 'https://api.tvmaze.com/shows';
    const data = await getData(uri);
    parsedData(data);

}

function clearData(){
    const tblEl = document.getElementById('tbl-body');
    tblEl.textContent = "";

    const counter = document.getElementById('data_count');
    counter.textContent = 0;
}

function parsedData(data){

    var rows = '';
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

    
    const tblEl = document.getElementById('tbl-body');
    tblEl.innerHTML = rows;
    const counter = document.getElementById('data_count');
    counter.innerHTML = data.length;
    
}
// implements an HTTP client
// using the fetch api
async function getData(url)
{
    // STEP 1 - Configure the request header
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
    const response = await fetch(url, request);
    if (response.status == 200){
        const data = response.json();
        return data;
    }
}

// event delegation
function removeItem(e){
    let target, elParent, elGrandParent;
    target = e.target || e.srcElement;
    elParent = target.parentNode;
    elGrandParent = elParent.parentNode;
    elGrandParent.removeChild(elParent);

}

// add the function to the event using event listeners
// let btn_el = document.getElementById('shows_btn_id');
// btn_el.addEventListener('click', function(){fetchShows();}, false);

// traditional DOM way
document.getElementById('shows_btn_id').onclick = fetchShows;
document.getElementById('clear_btn').onclick = clearData;

// event delegation
document.getElementById('tbl-body').addEventListener('click', function(e){removeItem(e);},false);