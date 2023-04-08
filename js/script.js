async function fetchShows(){
    const uri = 'https://api.tvmaze.com/shows';
    const datas = await getData(uri);
    //console.log(datas);
    parsedData(datas);

}

function parsedData(datas){

    var rows = '';
    datas.forEach(data => {
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
    counter.innerHTML = datas.length;
    
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