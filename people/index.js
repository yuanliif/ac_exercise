const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const modalFooter = document.querySelector('.modal-footer')
const cardFooter = document.querySelector('.card-footer')

const searchInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-button')
const searchForm = document.querySelector("#search-form")

const friendList = []
let filterList = []
// 此變數可以幫助判斷是否已經加入我的最愛
const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []

const pagination = document.querySelector('.pagination')

const people_per_page = 20

function renderpeople(data) {
  let rawHTML = `<div class="row">`
  data.forEach((item) => {
    let heart = ''
    if (list.some((friend) => friend.id === item.id)){
      heart = "fas fa-heart align-self-center remove-from-heart"
    }else{
      heart = "far fa-heart align-self-center add-to-heart"
    }
    rawHTML += `<div class="row shadow m-3">
      <div class="card border-light" style="width: 12rem;">
        <img src="${item.avatar}" class="card-img-top " alt="...">
        <div class="card-body">
          <h5 class="card-title mx-auto"><em><strong>${item.name} ${item.surname}</strong></em></h5>
        </div>
        <div class="card-footer d-flex justify-content-sm-around ">
          <button type="button" class="btn btn-outline-info btn-show-people" 
            data-id="${item.id}" data-toggle="modal" data-target="#peopleInfo">More Info</button>
            <i role="button" class="${heart}" data-id="${item.id}"></i>
        </div>
      </div>
    </div>
  `
  })
  rawHTML += `</div>`
  return dataPanel.innerHTML = rawHTML
}

// render Modal List
function renderModal(num) {
    let modleAvatar = document.querySelector('#modal-avatar')
    let modleName = document.querySelector('#modal-name')
    let modalAge = document.querySelector('#modal-age')
    let modalRegion = document.querySelector('#modal-region')
    let modalBirthday = document.querySelector('#modal-birthday')
    let modalGender = document.querySelector('#modal-gender')
    let modalEmail = document.querySelector('#modal-email')

    axios.get(INDEX_URL + num).then((response) => {
      // console.log(response.data)
      let data = response.data
      modleName.innerText = `${data.name} ${data.surname}`
      modalAge.innerText = `Age: ${data.age}`
      modalRegion.innerText = `I came from ${data.region}`
      modalBirthday.innerText = `Birthday: ${data.birthday}`
      modleAvatar.innerHTML = `<img src="${data.avatar}" style="width: 100%; border-radius: 50%;" alt="">`
      modalGender.innerText = `${data.gender}`
      modalEmail.innerText = `contact me: ${data.email}`
      // 判斷是否已經加入favorite來改變按鈕功能
      if (list.some((friend) => friend.id === num)) {
        return modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-danger btn-remove-favorite" data-dismiss="modal" data-id="${data.id}">Remove from Favorite</button>
    `
      }
      return modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      <button type="button" class="btn btn-primary btn-add-favorite" data-dismiss="modal" data-id="${data.id}">Add to Favorite</button>
`  
    })
}

// add people to favorite in localStorage
function addToFavorite(num){
  // console.log(num)
  
  const friends = friendList.find((friend) => friend.id === num)
  if (list.some((friend) => friend.id === num)) {
    return alert('此人已加入我的最愛')
  }
  list.push(friends)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
  alert('成功加入我的最愛')
}
// remove people from favorite in localStorage
function removeFavorite (num) {
  const friendIndex = list.findIndex((friend) => friend.id === num)
  if (friendIndex === -1) return

  if (confirm('確定移除嗎?')) {
    list.splice(friendIndex, 1)
    localStorage.setItem('favoriteFriends', JSON.stringify(list))
  }
}

// paginator
function totalPagePaginator (page) {
  const data = filterList.length? filterList : friendList
  const startIndex = (page - 1) * people_per_page
  return data.slice(startIndex, startIndex + people_per_page)
}

function renderPaginator (data) {
  const totalPageNum = Math.ceil(data/people_per_page)
  let rawHTML = ''
  for(let i = 1; i <= totalPageNum; i++){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }
  pagination.innerHTML = rawHTML
}

axios.get(INDEX_URL).then((response) => {
  // console.log(response.data.results)
  
  friendList.push(...response.data.results)
  renderpeople(totalPagePaginator(1))
  renderPaginator(friendList.length)
  // console.log(friendList)
})
.catch((error) => console.log(error))

// render Modal List click event
dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-people')){
    renderModal(Number(event.target.dataset.id))
  }else if(event.target.matches('.add-to-heart')){
    addToFavorite(Number(event.target.dataset.id))
    event.target.className = "fas fa-heart align-self-center remove-from-heart"
    alert('加入favorite list')
  }else if(event.target.matches('.remove-from-heart')){
    removeFavorite(Number(event.target.dataset.id))
    event.target.className = "far fa-heart align-self-center add-to-heart"
  }
})

// add to Favorite in modal
modalFooter.addEventListener('click', (event) => {
  if (event.target.matches('.btn-add-favorite')){
    // console.log(cardFooter)
    cardFooter.lastElementChild.className = "fas fa-heart align-self-center remove-from-heart"
    console.log(cardFooter.lastElementChild)
    addToFavorite(Number(event.target.dataset.id))
    
  }else if(event.target.matches('.btn-remove-favorite')){
    cardFooter.lastElementChild.className = "far fa-heart align-self-center add-to-heart"
    removeFavorite(Number(event.target.dataset.id))
  }
})

// search input listener
searchForm.addEventListener('submit', function searchFormclicked(event){
  event.preventDefault()
  let keyword = searchInput.value.trim().toLowerCase()
  // console.log(keyword)
  filterList = friendList.filter((friend) => {
    // console.log(friend.name)
    return friend.name.toLowerCase().includes(keyword) ||
    friend.surname.toLowerCase().includes(keyword)
  })
  if (filterList.length === 0) {
    return alert(`找不到符合:${keyword}的關鍵字`)
  }
  renderpeople(totalPagePaginator(1))
  renderPaginator(filterList.length)

  // console.log(filterList)
})

pagination.addEventListener('click', function paginationclicked (event) {
  if (event.target.tagName !== 'A') return
  const page = event.target.dataset.page
  // console.log(page)
  renderpeople(totalPagePaginator(page))
})

