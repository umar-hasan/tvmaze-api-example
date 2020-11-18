/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {

  const response = await axios.get('http://api.tvmaze.com/search/shows', {params: {q: query}})

  return response.data.map((val) => {
    return val.show
  })
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let imageUrl
    try {
      imageUrl = show.image.medium
    } catch(e) {
      imageUrl = 'https://tinyurl.com/tv-missing'
    }
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card show-card" data-show-id="${show.id}">
           <img src="${imageUrl}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <div class="card-footer">
            <button class="episode-btn btn-primary" type="button" data-target="#episodes-section">
              Episode List
            </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

$("#shows-list").on("click", ".episode-btn", async function (e) {
  let episodes = await getEpisodes($(this).parent().parent().attr("data-show-id"))
  $('#show-title').text($(this).parent().parent().find(".card-title").text())
  populateEpisodes(episodes)
  $('#episodes-section').modal("toggle")
})

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {

  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  return response.data
}

function populateEpisodes(episodes) {
  const $list = $("#episode-list")
  
  for (let episode of episodes) {
    let $item = `
      <li>${episode.name}</li>
    `
    $list.append($item)
  }
}