const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const modalFooter = document.querySelector('.modal-footer')

const searchInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-button')
const searchForm = document.querySelector("#search-form")

const friendList = JSON.parse(localStorage.getItem('favoriteFriends'))


function renderpeople(data) {
  let rawHTML = `<div class="row">`
  data.forEach((item) => {
    rawHTML += `<div class="row shadow m-3">
      <div class="card border-light" style="width: 12rem;">
        <img src="${item.avatar}" class="card-img-top " alt="...">
        <div class="card-body">
          <h5 class="card-title mx-auto"><em><strong>${item.name} ${item.surname}</strong></em></h5>
        </div>
        <div class="card-footer d-flex justify-content-sm-around ">
          <button type="button" class="btn btn-outline-info btn-show-people" 
            data-id="${item.id}" data-toggle="modal" data-target="#peopleInfo">More Info</button>
            <i role="button" class="fas fa-heart align-self-center remove-from-heart" data-id="${item.id}"></i>

        </div>
      </div>
    </div>
  `
  })
  rawHTML += `</div>`
  dataPanel.innerHTML = rawHTML
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
    modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-danger btn-remove-favorite" data-dismiss="modal" data-id="${data.id}">Remove from Favorite</button>
    `
    // console.log(modalFooter.lastElementChild)

  })
}

// remove from favorite
function removeFavorite (num) {
  if (!friendList) return
  const friendIndex = friendList.findIndex((friend) => friend.id === num)
  if (friendIndex === -1) return

  if (confirm('確定移除嗎?')) {
    friendList.splice(friendIndex, 1)
    localStorage.setItem('favoriteFriends', JSON.stringify(friendList))
    renderpeople(friendList)
  }
  
}

// render Modal List click event
dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-people')){
    renderModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.remove-from-heart')){
    removeFavorite(Number(event.target.dataset.id))
  }
})

modalFooter.addEventListener('click', (event) => {
  if (event.target.matches('.btn-remove-favorite')){
    // console.log(event.target)
    removeFavorite(Number(event.target.dataset.id))
  }
})

renderpeople(friendList)