var _temp;

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

const CardRenderer =
    ((_temp = class CardRenderer {
        constructor() {
            var _this = this;

            _defineProperty(this, "preRenderCards", function (response) {
                if (response.total_results === 0) {
                    cardsList.textContent = "";

                    if (response.hasOwnProperty("errors")) {
                        outputTextInfo.textContent =
                            "Incorrect request to the API from the service side. " +
                            "Please report the error to Mishanja.";
                    } else {
                        outputTextInfo.textContent =
                            "Sorry, nothing was found for your request";
                    }
                } else {
                    // clear card list if it is a first page
                    if (response.page === 1) cardsList.textContent = "";
                    response.results.forEach(function (item) {
                        _this.renderCard(item);
                    });
                } // pagination

                if (response.page < response.total_pages) {
                    paginator.style.visibility = "visible";
                    nextPage = response.page + 1;
                } else {
                    paginator.style.visibility = "hidden";
                }

                loading.remove();
            });

            _defineProperty(this, "renderCard", function (item) {
                const card = document.createElement("li");
                card.uniqId = item.id;
                card.classList.add("cards__item"); // movie card does not contains name field

                const title = item.name ? item.name : item.title;
                const cardClass = item.name ? "card tv" : "card movie";
                const cardType = item.name ? "TV series & shows" : "Movie";
                const {
                    poster_path: poster,
                    backdrop_path: backdrop,
                    vote_average: vote
                } = item;
                const posterIMG = poster ? IMAGE_URL + poster : "img/no-poster.jpg";
                const backdropIMG = backdrop
                    ? IMAGE_URL + backdrop
                    : "img/no-poster.jpg";
                const voteValue = vote ? `<span class="card__vote">${vote}</span>` : "";
                card.innerHTML = `
        <a href="#" id="${card.uniqId}" class="${cardClass}">
            ${voteValue}
            <span class="card__type">${cardType}</span>
            <img class="card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="${title}">
            <h4 class="card__head">${title}</h4> 
        </a>
        `;
                cardsList.append(card);
            });
        }
    }),
        _temp);
