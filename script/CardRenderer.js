const CardRenderer = class {

    renderCards = (response) => {
        if (response.total_results === 0) {
            cardsList.textContent = "";
            if (response.hasOwnProperty("errors")) {
                outputTextInfo.textContent = "Некорректный запрос к API со стороны сервиса. " +
                    "Пожалуйста, сообщите об ошибке";
            } else {
                outputTextInfo.textContent = "К сожалению, по вашему запросу ничего не обнаружено";
            }
        } else {
            // clear card list if it is a first page
            if (response.page === 1) {
                cardsList.textContent = "";
            }

            response.results.forEach(item => {
                // movie card does not contains name field
                if (item.hasOwnProperty("name")) {
                    this.renderTvCards(item);
                } else {
                    this.renderMovieCards(item);
                }
            });
        }
        // pagination
        if (response.page < response.total_pages) {
            paginator.style.visibility = "visible";
            nextPage = response.page + 1;
        } else {
            paginator.style.visibility = "hidden";
        }
        loading.remove();
    }

    // card rendering from response
    renderTvCards = (item) => {
        const card = document.createElement("li");
        card.uniqId = item.id;
        card.classList.add("cards__item");

        const {
            name: filmName,
            poster_path: poster,
            backdrop_path: backdrop,
            vote_average: vote
        } = item;

        const posterIMG = poster ? IMAGE_URL + poster : "img/no-poster.jpg";
        const backdropIMG = backdrop ? IMAGE_URL + backdrop : "img/no-poster.jpg";
        const voteValue = vote ? `<span class="card__vote">${vote}</span>` : "";

        card.innerHTML = `
        <a href="#" id="${card.uniqId}" class="card tv">
            ${voteValue}
            <span class="card__type">Сериал & Шоу</span>
            <img class="card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="${filmName}">
            <h4 class="card__head">${filmName}</h4> 
        </a>
        `;
        cardsList.append(card);
    };

    renderMovieCards = (item) => {
        const card = document.createElement("li");
        card.uniqId = item.id;
        card.classList.add("cards__item");

        const {
            title: filmName,
            poster_path: poster,
            backdrop_path: backdrop,
            vote_average: vote
        } = item;

        const posterIMG = poster ? IMAGE_URL + poster : "img/no-poster.jpg";
        const backdropIMG = backdrop ? IMAGE_URL + backdrop : "img/no-poster.jpg";
        const voteValue = vote ? `<span class="card__vote">${vote}</span>` : "";

        card.innerHTML = `
        <a href="#" id="${card.uniqId}" class="card movie">
            ${voteValue}
            <span class="card__type">Кинофильм</span>
            <img class="card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="${filmName}">
            <h4 class="card__head">${filmName}</h4> 
        </a>
        `;
        cardsList.append(card);
    };

}