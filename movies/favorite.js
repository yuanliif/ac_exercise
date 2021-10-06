const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []


// renderMovieList
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(element => {
    rawHTML += `<div class="col-sm-3">
  <div class="mb-2">
    <div class="card">
      <img
      src="${POSTER_URL + element.image}"
      class="card-img-top"
      alt="Movie Poster">
      <div class="card-body">
        <h5 class="card-title">${element.title}</h5>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary btn-show-movie" 
        data-toggle="modal" 
        data-target="#movie-modal"
        data-id="${element.id}">More</button>
        <button class="btn btn-danger btn-remove-favorite"
        data-id="${element.id}">X</button>
      </div>
    </div>
  </div>
</div>
  `
  });
  dataPanel.innerHTML = rawHTML
}

// showMovieModal
function showMovieModal(id) {
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')
  const movieImage = document.querySelector('#movie-modal-image')
  
  axios.get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results
      movieTitle.innerText = data.title
      movieDate.innerText = data.release_date
      movieDescription.innerText = data.description
      // console.log(movieImage)
      movieImage.innerHTML = `<img src="${POSTER_URL + data.image}" 
      alt="movie-poster" class="img-fluid">`
    })
    .catch((err) => console.log(err))
}

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return

  if (confirm('確定要移除此部電影')){
    movies.splice(movieIndex, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
    renderMovieList(movies)
  }
}

// 點擊More的按鈕指令
dataPanel.addEventListener('click', function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)