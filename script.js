const API_URL = "http://www.omdbapi.com";
const API_KEY = "b49e8000";
const filmTitle = document.querySelector("#filmTitle");
const filmType = document.querySelector("#filmType");

const filmContainer = document.querySelector(".film-container");

let btnSearch = document.querySelector("#search");

let pageCounter = 1;
const paginatorPrev = document.querySelector("#paginatorPrev");
const paginatorNext = document.querySelector("#paginatorNext");
let lastPageNumber;

let modal = document.querySelector("#myModal");
let span = document.querySelector(".close");

console.log(filmTitle);

paginatorPrev.addEventListener("click", () => {
    
    pageCounter--;
    if (pageCounter === 1) {
        paginatorPrev.disabled = true; 
    }

    if (pageCounter < lastPageNumber) {
        paginatorNext.disabled = false;
    }

    getMovies();
})

paginatorNext.addEventListener("click", () => {
    pageCounter++;

    if (pageCounter > 1) {
        paginatorPrev.disabled = false;
    }

    if (pageCounter === lastPageNumber) {
        paginatorNext.disabled = true;
    }

    getMovies();
})

function getFilmsByTitle(title, type, page) {
    return fetch(`${API_URL}/?apikey=${API_KEY}&s=${title}&type=${type}&page=${page}`)
    .then((response) => response.json());
}

function getMovieById(id) {
    return fetch(`${API_URL}/?apikey=${API_KEY}&i=${id}`)
    .then((response) => response.json());
}

function getFilmTitle() {
    return filmTitle.value;
}

function getFilmType() {
    return filmType.value;
}

function getMovies() {
    getFilmsByTitle(getFilmTitle(), getFilmType(), pageCounter)
    .then((data) => {
        const films = data.Search;
        lastPageNumber = Math.ceil(data.totalResults / 10);

        if (lastPageNumber === 1) {
            paginatorPrev.disabled = true;
            paginatorNext.disabled = true;
        }
        
        showFilms(films);
        console.log(data);
        console.log(lastPageNumber);
})
}


function showFilms(films) {
    let filmItem = "";

    for (let film of films) {
        filmItem += `
        <div class="film-container_item">
            <div class="film-container_item-image">
                <img src="${film.Poster}" alt="">
            </div>
        
            <div class="film-container_item-info">
                <div class="film-container_item-info-type">${film.Type}</div>
                <div class="film-container_item-info-title">${film.Title}</div>
                <div class="film-container_item-info-year">${film.Year}</div>

                <div>
                <button class="film-container_item-info-details" data-id="${film.imdbID}">Details</button>
                </div>
            </div>

        </div>
        `
    }

    filmContainer.innerHTML = filmItem;

    const showInfoButtons = document.querySelectorAll(".film-container_item-info-details");

    for (let btn of showInfoButtons) {
        btn.addEventListener("click", function() {
            console.log(this.dataset.id);
            const id = this.dataset.id;
                        
            getMovieById(id)
            .then((movie) => {
                console.log(movie);
                showSelectedMovie(movie);

                getFilmInModalWindow();
            })
            
        })
    }
}

getMovies();

btnSearch.addEventListener("click", function() {
    pageCounter = 1;
    paginatorPrev.disabled = true;
    getMovies();
});

function showSelectedMovie(movie) {
    let aboutFilm = document.querySelector("#about-film");
    aboutFilm.classList.add("show");

    let img = document.querySelector(".about-film-info-image img");
    img.src = `${movie.Poster}`;

    let title = document.querySelector(".about-film-info-describe-title-name");
    title.innerHTML = `${movie.Title}`;

    let released = document.querySelector(".about-film-info-released-date");
    released.innerHTML = `${movie.Released}`;

    let genre = document.querySelector(".about-film-info-genre-type");
    genre.innerHTML = `${movie.Genre}`;

    let country = document.querySelector(".about-film-info-country-name");
    country.innerHTML = `${movie.Country}`;

    let directorFilm = document.querySelector(".about-film-info-director-person");
    directorFilm.innerHTML = `${movie.Director}`;

    let writerFilm = document.querySelector(".about-film-info-writer-person");
    writerFilm.innerHTML = `${movie.Writer}`;

    let actors = document.querySelector(".about-film-info-actors-group");
    actors.innerHTML = `${movie.Actors}`;

    let awards = document.querySelector(".about-film-info-awards-item");
    awards.innerHTML = `${movie.Awards}`;

}

function getFilmInModalWindow() {
    modal.style.display = "block";

    // Когда пользователь нажимает на <span> (x), закройте модальное окно
    span.addEventListener("click", function() {
        modal.style.display = "none";
    })

    // Когда пользователь щелкает в любом месте за пределами модального, закройте его
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}
