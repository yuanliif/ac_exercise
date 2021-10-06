const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const movies = [] 
// 搜尋
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const searchSumit = document.querySelector('#search-sumit')

const moviesPerPage = 12
let filterMovie = []

const paginator = document.querySelector('#paginator')

// card&list mode display
const btnMode = document.querySelector('#btn-mode')
// 想要辨識有沒有在我的最愛中改變按鈕樣式
const addOrRemove = document.querySelector('.add-or-remove')
const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []

// 預設的頁面顯示
let currentPage = 1
let selectedMovieAmount = 0
let currentDisplayMode = 'Card' 

// 統整的頁面控制function
function renderMoviePage () {
  renderPaginator(selectedMovieAmount)
  // 藉由判斷currentDisplayMode來改變顯示的內容
  if (currentDisplayMode === 'card') {
    renderMovieCard(getMoviesByPage(currentPage))
    // console.log(addOrRemove)
  } else if (currentDisplayMode === 'list') {
    renderMovieList(getMoviesByPage(currentPage))
    // console.log(addOrRemove)
  } else {
    renderMovieCard(getMoviesByPage(currentPage))
  }
}

// renderMovieList
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(element => {
    let addRemoveBtm = ''
    if (list.some((movie) => movie.id === element.id)) {
      addRemoveBtm = `<button type="button" class="btn btn-danger btn-remove-favorite" data-id=${element.id}>X</button>`
    } else {
      addRemoveBtm = `<button type="button" class="btn btn-info btn-add-favorite" data-id=${element.id}>+</button>`
    }
    rawHTML +=`<div class="col-sm-12 border-top mb-3 pt-3">
    <div class="row">
      <div class="col-sm-8">
        <h5 class="card-title">${element.title}</h5>
      </div>
      <div class="col-sm-4 add-or-remove">
        <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal"
          data-id=${element.id}>More</button>
        ${addRemoveBtm}
      </div>
    </div>
  </div>
  `
  })
  
  return dataPanel.innerHTML = rawHTML
}

function renderMovieCard(data) {
  let rawHTML = ''
  data.forEach(element => {
    let addRemoveBtm = ''
    if (list.some((movie) => movie.id === element.id)) {
      addRemoveBtm = `<button type="button" class="btn btn-danger btn-remove-favorite" data-id=${element.id}>X</button>`
    } else {
      addRemoveBtm = `<button type="button" class="btn btn-info btn-add-favorite" data-id=${element.id}>+</button>`
    }
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
      <div class="card-footer add-or-remove">
        <button class="btn btn-primary btn-show-movie" 
        data-toggle="modal" 
        data-target="#movie-modal"
        data-id="${element.id}">More</button>
        ${addRemoveBtm}
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
      movieDate.innerText = 'release date' + data.release_date
      movieDescription.innerText = data.description
      // console.log(movieImage)
      movieImage.innerHTML = `<img src="${POSTER_URL + data.image}" 
      alt="movie-poster" class="img-fluid">`
    })
    .catch((err) => console.log(err))
}

// 加入我的最愛
function addToFavorite (id) {
  // console.log(Number(event.target.dataset.id))
  let movie = movies.find((movie) => movie.id === id)
  // console.log(movie)
  if (list.some((movie) => movie.id === id)){
    return alert('電影已經存在列表中')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  alert('成功加入我的最愛')
  renderMoviePage()
  console.log(dataPanel)
}

// 移除我的最愛
function removeFromFavorite(id) {
  const movieIndex = list.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return

  if (confirm('確定要移除此部電影')){
    list.splice(movieIndex, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
    renderMoviePage()
    console.log(dataPanel)
  }
}

// 一頁顯示的電影
function getMoviesByPage(page) {
  const data = filterMovie.length? filterMovie : movies

  const startIndex = (page - 1) * moviesPerPage
  return data.slice(startIndex, startIndex + moviesPerPage)
}

// Paginator顯示
function renderPaginator(amount) {
  let rawHTML = ''
  let numberOfPages = Math.ceil(amount / moviesPerPage)
  for (let i = 1; i <= numberOfPages; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" 
    data-page="${i}">${i}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 點擊List &　Card
btnMode.addEventListener('click', function(event) {
  if (event.target.matches('.list-mode')) {
    currentDisplayMode = 'list'
    renderMoviePage()
    // console.log("1")
  } else if (event.target.matches('.card-mode')){
    currentDisplayMode = 'card'
    renderMoviePage()
    // console.log('2')
  }
})

// 點擊More&+的按鈕指令
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')){
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSumitted(event) {
  event.preventDefault()
  // console.log(event)
  const keyword = searchInput.value.trim().toLowerCase()
 
  filterMovie = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  // console.log(filterMovie)
  if (filterMovie.length === 0){
    return alert(`cannot find movie with ${keyword}`)
  } else {
    // 搜尋完成後回到第一頁並且改變電影總數
    selectedMovieAmount = filterMovie.length
    currentPage = 1
  }
  renderMoviePage()
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  // 經由點擊的頁碼，來變更現在的頁碼為多少
  currentPage = Number(event.target.dataset.page)
  renderMoviePage()
})

// 呼叫renderMovieList
axios.get(INDEX_URL)
  .then((response) => {
    // console.log(response.data.results)
    movies.push(...response.data.results)
    // console.log(movies)
    selectedMovieAmount = movies.length
    
    renderMoviePage()
  })
  .catch((err) => console.log(err))