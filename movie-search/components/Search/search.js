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
      getMovies(searchText);
    }
    e.preventDefault();
  });
});

function getTranslation (searchText) {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200424T123704Z.20495078d07340ab.0a8c19413f7291513d399c7f843a551590fb7636&text=${searchText}&lang=ru-en`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      let translateWord = data.text;
      console.log(translateWord);
      getMovies(translateWord);
      let errorArea = document.querySelector(".error-area");
      errorArea.innerText = `Фильмы по запросу ${searchText}`;
    });
};

let swiper = new Swiper ('.swiper-container', {
  // loop: true,
  slidesPerView: 4,
  spaceBetween: 40,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})

getMovies('Arnold');
function getMovies(searchText){
  let errorArea = document.querySelector(".error-area");
  errorArea.innerText = '';
  axios.get(`http://www.omdbapi.com?s=${searchText}&apikey=36a4af9d`)
    .then((response) => {
      console.log(response);
      if(response.data.Error == 'Too many results.'){
        let errorArea = document.querySelector(".error-area");
        errorArea.innerText = "Не удалось найти фильмы, соответствующие запросу..."
      }
      let movies = response.data.Search;
      let slides = document.querySelectorAll('.swiper-slide');
      let moviesRatings = [];
      // for (let i = 0; i < 10; i++) {
      //   let responseMovies = [];
      //   responseMovies.push(movies[i].imdbID);
      // }
      //   for(let i = 0; i < 10; i++){
      //     axios.get(`http://www.omdbapi.com?i=${responseMovies[i]}&apikey=36a4af9d`)
      //       .then((response) => {
      //       let movie = response.data;
      //       moviesRatings.push(movie.imdbRating);
      //       console.log(moviesRatings[0]);
      //     })
      //   }
      
      
      
      $.each(movies, (index, movie) => {
        
        slides[index].innerHTML = `
        <div class="swiper-slide style="width: 390.75px; margin-right: 50px;">
              <h5 class="card-title">${movie.Title}</h5>
              <img src="${movie.Poster}" class="card-image" alt="Movie Image">
              <span class="card-year">${movie.Year}</span>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
          </div>
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

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
  
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get(`http://www.omdbapi.com?i=${movieId}&apikey=36a4af9d`)
    .then((response) => {
      console.log(response);
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
          <div class="well">
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

let audioClick = new Audio();
audioClick.src = 'audio/click.mp3';

let inputButton = document.querySelector(".search-button");
inputButton.addEventListener('click', ()=>{
  audioClick.play();
})


