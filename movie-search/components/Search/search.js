// Получение текста из поля ввода
$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    if(searchText === ""){
      let errorArea = document.querySelector(".error-area");
      errorArea.innerText = "Введите корректный запрос";
    }
    else if(searchText.search(/[А-яЁё]/) !== -1){
      getTranslation(searchText);
    }
    else{
      getMovies(searchText, 1);
    }
    e.preventDefault();
  });
});

let currentSearchWord = 'Word';
let currentPage = 1;
sessionStorage.setItem('currentPage', currentPage);
sessionStorage.setItem('currentSearchWord', currentSearchWord);
// Загрузка следующей и предыдущей страниц
const nextButton = document.querySelector(".next-button");
const prevButton = document.querySelector(".prev-button");

// Следующая страница
nextButton.addEventListener('click', ()=>{
  let textarea = document.querySelector('.input-area');
  let currentPage = sessionStorage.getItem('currentPage');
  let searchPage = Number(currentPage);
  searchPage += 1;
  let errorArea = document.querySelector(".error-area");
  errorArea.innerText = '';
  if(textarea.value === ''){
    searchText = sessionStorage.getItem('currentSearchWord');
    getMovies(searchText, searchPage);
  }
  else if(textarea.value.search(/[А-яЁё]/) !== -1){
    getTranslation(textarea.value);
  }
  else {
    searchText = textarea.value;
    getMovies(searchText, searchPage);
  }
    sessionStorage.setItem('currentPage', searchPage);
});

// Предыдущая страница
prevButton.addEventListener('click', ()=>{
  let textarea = document.querySelector('.input-area');
  let textareaValue = textarea.value;
  let currentPage = sessionStorage.getItem('currentPage');
  let searchPage = Number(currentPage);
  if(searchPage == 1){
    searchPage = 1;
  }
  else {
    searchPage -= 1;
  }
  
  let errorArea = document.querySelector(".error-area");
  errorArea.innerText = '';
  if(textareaValue === ''){
    searchText = sessionStorage.getItem('currentSearchWord');
    getMovies(searchText, searchPage);
  }
  else if(textarea.value.search(/[А-яЁё]/) !== -1){
    getTranslation(textarea.value);
  }
  else {
    searchText = textarea.value;
    getMovies(searchText, searchPage);
  }
    sessionStorage.setItem('currentPage', searchPage);
});



// Получение перевода слова, если введено русское
function getTranslation (searchText) {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200424T123704Z.20495078d07340ab.0a8c19413f7291513d399c7f843a551590fb7636&text=${searchText}&lang=ru-en`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      let translateWord = data.text;
      let currentPage = sessionStorage.getItem('currentPage');
      let page = Number(currentPage);
      getMovies(translateWord, page);
      let errorArea = document.querySelector(".error-area");
      errorArea.innerText = `Фильмы по запросу ${searchText}`;
    });
};

// Очистка поля ввода
const erraseButton = document.querySelector(".clear-button");
erraseButton.addEventListener('click', ()=>{
  let searchArea = document.querySelector(".input-area");
  searchArea.value = "";
  let errorArea = document.querySelector(".error-area");
  errorArea.innerText = "";
})

// Свайпер (инициализация)
let swiper = new Swiper ('.swiper-container', {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // Responsive breakpoints
  breakpoints: {
    320: {
      slidesPerView: 1.085,
      spaceBetween: 20,
    },
    375: {
      slidesPerView: 1.135,
      spaceBetween: 20, 
    },
    425: {
      slidesPerView: 1.28,
      spaceBetween: 10
    },
    768:{
      slidesPerView: 2.2,
      spaceBetween: 30
    },
    1024: {
      slidesPerView: 2.8,
      spaceBetween: 40
    },
    1440:{
      slidesPerView: 3.9,
      spaceBetween: 40
    },
    1600: {
      slidesPerView: 5.6,
      spaceBetween: 40
    },
    1900: {
      slidesPerView: 5.1,
      spaceBetween: 40
    }
  }
})

// Вызов функции при старте 
getMovies(currentSearchWord, currentPage);

// Функция по поиску фильмов
function getMovies(searchText, page){
  let errorArea = document.querySelector(".error-area");
  errorArea.innerText = '';
  axios.get(`https://www.omdbapi.com?s=${searchText}&page=${page}&apikey=36a4af9d`) 
  
    .then((response) => {
        if(response.data.Error == 'Too many results.'){
          let errorArea = document.querySelector(".error-area");
          errorArea.innerText = "Не удалось найти фильмы, соответствующие запросу..."
        }
        if(response.data.Error == 'Movie not found!'){
          let errorArea = document.querySelector(".error-area");
          errorArea.innerText = "Не удалось найти фильмы, соответствующие запросу... Скорее всего, ваш запрос некорректный"
        }  
        let movies = response.data.Search;
        const slides = document.querySelectorAll('.slide');
  
        $.each(movies, (index, movie) => {
          slides[index].innerHTML = `
                <h5 class="card-title">${movie.Title}</h5>
                <img src="${movie.Poster}" class="card-image" alt="Movie Image">
                <span class="card-year">${movie.Year}</span>
                <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
          `;
        });
      let buttons = document.querySelectorAll('.btn-primary');
      buttons.forEach(elem =>{
        elem.addEventListener('click', ()=>{
          audioClick.play();
        })
      })
    })
    .catch((err) => {
      console.log(err);
    });
}

// Переменная выбранного фильма для запроса ниже
function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
  
}

// Страница Фильма (подробная информация)
function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get(`https://www.omdbapi.com?i=${movieId}&apikey=36a4af9d`)
    .then((response) => {
      let movie = response.data;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="movie-img">
          </div>
          <div class="col-md-8">
            <h2 class="movie-title-2">${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Жанр:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Релиз:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Рейтинг:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Рейтинг:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Режиссер:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Автор:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Актёры:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well plot">
            <h3>Сюжет</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">Посмотреть на IMDB</a>
            <a href="index.html" class="btn btn-secondary">Назад к поиску</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
      let movieButton = document.querySelector('btn-primary');
      movieButton.addEventListener('click', ()=>{
          audioClick.play();
        })
    })
    .catch((err) => {
      console.log(err);
    });

}

// Аудио клик

let audioClick = new Audio();
audioClick.src = 'audio/click.mp3';

let inputButton = document.querySelector(".search-button");
inputButton.addEventListener('click', ()=>{
  audioClick.play();
})

// Keyboard
const keyboardButton = document.querySelector(".keyboard-button");
keyboardButton.addEventListener('click', keyboardCreate);

function keyboardCreate(){
  let keyboardContainer = document.querySelector(".keyboard-container");
  keyboardContainer.classList.remove("keyboard-hide");

  keyboardButton.classList.add('keyboard-hide');

  let keyboardButtonClose = document.querySelector(".keyboard-button-close");
  keyboardButtonClose.classList.remove('keyboard-hide');
  keyBoard();
  
}

// скрываем виртуальную клавиатуру при ширине менее 1024px
$(window).resize(function(){
  let breakPoint = '1024';
  if ($(this).width() < breakPoint) {
    keyboardButton.classList.add('keyboard-hide');
  } 
  else {
    keyboardButton.classList.remove('keyboard-hide');
  }
});
$(window).resize();
