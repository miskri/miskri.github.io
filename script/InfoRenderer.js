cardInfoRenderer = (card) => {
    //tv card info rendering
    if (card.classList.contains("tv")) {
        renderMoreInfo(dbServiceUnit.getTvCard(card.id));
    } else if (card.classList.contains("movie")) { // movie card rendering
        renderMoreInfo(dbServiceUnit.getMovieCard(card.id));
    }
};

renderMoreInfo = (promise) => {
    promise.then(response => {
        cardImg.src = IMAGE_URL + response.poster_path;
        cardImg.alt = response.name ? response.name : response.title;
        title.textContent = response.name ? response.name : response.title;
        genresList.textContent = "";
        for (const item of response.genres) {
            const genreName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            genresList.innerHTML += `<li>${genreName}</li>`;
        }
        const voteInfo = `${response.vote_average} (на основании ${response.vote_count} голосов)`;
        rating.textContent = response.vote_average ? voteInfo : "Нет оценки";
        description.textContent = response.overview;
        modalLink.href = response.homepage;
    })
        .then(() => {
        document.body.style.overflow = "hidden";
        modal.classList.remove("hide");
        loading.remove();
    });
};
