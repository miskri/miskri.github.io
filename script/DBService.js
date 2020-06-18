const DBService = class {

    constructor() {
        // temporary variable
        this.lang = "ru-RU";
        this.lastQuery = "";
        this.lastResults = [];
    };

    getData = async (url) => {
        return await fetch(url).then(resp => resp.json());
    };

    getTestData = () => {
        return this.getData("test.json");
    };

    getTestCard = () => {
        return this.getData("card.json");
    };

    //=======RESPONSE CONSTRUCTOR=======

    createDetailedResponse = (params) => {
        let result = `${SERVER_PATH}/discover/${params.category}?api_key=${API_KEY}&language=${this.lang}`;
        if (params.category === "movie") {
            if (params.sortBy !== "") {
                result += `&sort_by=${params.sortBy}` + params.sortByType;
            }
            if (params.withGenres.length > 0) {
                result += params.withGenres ? `&with_genres=` + params.withGenres.join() : "";
                result += params.withoutGenres ? `&without_genres=` + params.withoutGenres.join() : "";
            }
            result += "&include_adult=" + params.adultContent;
            if (params.voteCount !== -1) {
                result += `&vote_count${params.voteCountType}=` + params.voteCount;
            }
            if (params.voteAverage !== -1) {
                result += `&vote_average${params.voteAverageType}=` + params.voteAverage;
            }
        }
        return result;
    };

    getDetailedSearchResultsMovie = async (response) => {
        this.lastResponse = response;
        console.log(this.lastResponse);
        return this.getData(this.lastResponse);
    };

    getSearchResults = async (query = this.lastQuery, page = 1) => {
        this.lastResponse = "SIMPLE_SEARCH";
        if (page === 1) {
            this.lastResults = [];
        }
        this.lastQuery = query;
        const movieQuery = `${SERVER_PATH}/search/movie?api_key=${API_KEY}&query=${query}&language=${this.lang}&page=${page}`;
        const tvQuery = `${SERVER_PATH}/search/tv?api_key=${API_KEY}&query=${query}&language=${this.lang}&page=${page}`;
        const responses = [await this.getData(movieQuery), await this.getData(tvQuery)];
        // console.log(responses[0].total_results, responses[1].total_results) // TODO for testing
        const responseFinal = {page: 0, total_results: 0, total_pages: 0, results: []};
        // array for last 20-40 results replacing
        let itemResultsArray = [];
        responses.forEach(item => {
            if (!item.hasOwnProperty("errors")) {
                if (item.page > responseFinal.page) {
                    responseFinal.page = item.page;
                }
                responseFinal.total_results += item.total_results;
                itemResultsArray = itemResultsArray.concat(item.results);
            }
        });
        responseFinal.total_pages = Math.ceil(responseFinal.total_results / 20);
        let resultsCount = itemResultsArray.length + this.lastResults.length;
        if (resultsCount > 20) {
            itemResultsArray = this.replaceResults(itemResultsArray);
            resultsCount = 20;
        }
        this.lastResults = this.lastResults.concat(itemResultsArray);
        itemResultsArray = [];
        for (let i = 0; i < resultsCount; i++) {
            responseFinal.results[i] = this.lastResults.shift();
        }
        // console.log(responseFinal); // TODO for testing
        return responseFinal;
    };

    // result is fixed position, e.g. arr[5] = arr[8] TODO rewrite
    replaceResults = (results) => {
        let len = results.length - 2;
        for (let i = 0; i < len / 2; i += 2) {
            [results[i], results[len - i]] = [results[len - i], results[i]];
        }
        return results;
    };

    // result is random position, e.g. arr[5] = arr[9] || arr[5] = arr[17] || ...
    shuffleResults = (results) => {
        for (let i = results.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = results[i]
            results[i] = results[j]
            results[j] = temp
        }
        return results;
    };

    //=======TRENDING=======

    getTrendingDay = () => {
        this.lastResponse = `${SERVER_PATH}/trending/all/day?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    getTrendingWeek = () => {
        this.lastResponse = `${SERVER_PATH}/trending/all/week?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    //=======TV SHOWS=======

    getTopRatedTv = () => {
        this.lastResponse = `${SERVER_PATH}/tv/top_rated?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    getPopularTv = () => {
        this.lastResponse = `${SERVER_PATH}/tv/popular?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    getWeekTv = () => {
        this.lastResponse = `${SERVER_PATH}/tv/on_the_air?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    getTodayTv = () => {
        this.lastResponse = `${SERVER_PATH}/tv/airing_today?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    // tv card info
    getTvCard = id => {
        return this.getData(`${SERVER_PATH}/tv/${id}?api_key=${API_KEY}&language=${this.lang}`);
    };

    //=======MOVIES=======

    getTopRatedMovie = () => {
        this.lastResponse = `${SERVER_PATH}/movie/top_rated?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    getPopularMovie = () => {
        this.lastResponse = `${SERVER_PATH}/movie/popular?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    getNowPlayingMovie = () => {
        this.lastResponse = `${SERVER_PATH}/movie/now_playing?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    getNewestMovie = () => {
        this.lastResponse = `${SERVER_PATH}/movie/upcoming?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    };

    // movie card info
    getMovieCard = id => {
        return this.getData(`${SERVER_PATH}/movie/${id}?api_key=${API_KEY}&language=${this.lang}`);
    };

    //=======LAST RESPONSE=======

    getNextPageFromResponses = page => {
        console.log(this.lastResponse);
        if (this.lastResponse === "SIMPLE_SEARCH") {
            return this.getSearchResults(undefined, page);
        }
        return this.getData(this.lastResponse + `&page=${page}`);
    };
}