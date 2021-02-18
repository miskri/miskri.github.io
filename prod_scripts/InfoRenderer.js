const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

cardInfoRenderer = function (card) {
    //tv card info rendering
    if (card.classList.contains("tv"))
        renderMoreInfo(dbServiceUnit.getTvCard(card.id));
    else if (card.classList.contains("movie"))
        renderMoreInfo(dbServiceUnit.getMovieCard(card.id)); // movie card rendering
};

renderMoreInfo = function (promise) {
    promise
        .then(function (response) {
            genresList.textContent = "";
            prodCountriesList.textContent = "";
            cardImg.src = IMAGE_URL + response.poster_path;
            cardImg.alt = response.name ? response.name : response.title;
            title.textContent = response.name ? response.name : response.title;
            renderListItems(response.genres, genresList);
            const voteInfo = `${response.vote_average} (based on ${response.vote_count} votes)`;
            releaseYear.textContent = response.release_date
                ? prettyDateView(response.release_date)
                : prettyDateView(response.first_air_date);
            rating.textContent = response.vote_average ? voteInfo : "No rating";
            renderListItems(response.production_countries, prodCountriesList);
            description.textContent = response.overview;
            modalLink.href = response.homepage;
        })
        .then(function () {
            document.body.style.overflow = "hidden";
            modal.classList.remove("hide");
            loading.remove();
        });
};

renderListItems = function (source, destination) {
    for (const item of source) {
        const itemName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
        destination.innerHTML += `<li>${itemName}</li>`;
    }
};

prettyDateView = function (text) {
    if (text === undefined) return "-";
    const data = text.split("-");
    return `${months[parseInt(data[1])]} ${data[0]}`;
};
