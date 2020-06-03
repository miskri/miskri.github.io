const DBService = class {

    constructor() {
        // temporary variable
        this.lang = "ru-RU";
        this.lastQuery = "";
        this.lastResults = [];
    }

    getData = async (url) => {
        let response = {};
        response = await fetch(url).then(resp => resp.json().catch(() => {
            response = {total_results: 0, error: `Can not get data from url ${url}`};
        }));
        return response;
    }

    getTestData = () => {
        return this.getData("test.json");
    }

    getTestCard = () => {
        return this.getData("card.json");
    }

    //=======RESPONSE CONSTRUCTOR=======

    createDetailedResponse = () => {

    }

    getSearchResults = async (query = this.lastQuery, page = 1) => {
        this.lastResponse = "SEARCH";
        if (page === 1) {
            this.lastResults = [];
        }
        this.lastQuery = query;
        const movieQuery = `${SERVER_PATH}/search/movie?api_key=${API_KEY}&query=${query}&language=${this.lang}&page=${page}`;
        const tvQuery = `${SERVER_PATH}/search/tv?api_key=${API_KEY}&query=${query}&language=${this.lang}&page=${page}`;
        const responses = [await this.getData(movieQuery), await this.getData(tvQuery)];
        const responseFinal = {page: 0, total_results: 0, total_pages: 0, results: []};
        responses.forEach(item => {
            if (!item.error) {
                if (item.page > responseFinal.page) {
                    responseFinal.page = item.page;
                }
                responseFinal.total_results += item.total_results;
                if (item.total_pages > responseFinal.total_pages) {
                    responseFinal.total_pages = item.total_pages;
                }
                [].push.apply(this.lastResults, item.results);
            }
        });
        let resultsCount = this.lastResults.length;
        if (resultsCount > 20) {
            resultsCount = 20;
        }
        for (let i = 0; i < resultsCount; i++) {
            responseFinal.results[i] = this.lastResults.shift();
        }
        responseFinal.results = this.shuffleResults(responseFinal.results);
        return responseFinal;
    }

    shuffleResults = (results) => {
        const len = Math.floor((results.length - 1) / 2);
        for (let i = len; i < len; i++) {
            [results[i], results[len - i]] = [results[len - i], results[i]];
        }
        return results;
    }

    //=======TV SHOWS=======

    getTopRatedTv = () => {
        this.lastResponse = `${SERVER_PATH}/tv/top_rated?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    }

    getPopularTv = () => {
        this.lastResponse = `${SERVER_PATH}/tv/popular?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    }

    getWeekTv = () => {
        this.lastResponse = `${SERVER_PATH}/tv/on_the_air?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    }

    getTodayTv = () => {
        this.lastResponse = `${SERVER_PATH}/tv/airing_today?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    }

    // tv card info
    getTvCard = id => {
        return this.getData(`${SERVER_PATH}/tv/${id}?api_key=${API_KEY}&language=${this.lang}`);
    }

    //=======MOVIES=======

    getTopRatedMovie = () => {
        this.lastResponse = `${SERVER_PATH}/movie/top_rated?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    }

    getPopularMovie = () => {
        this.lastResponse = `${SERVER_PATH}/movie/popular?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    }

    getNowPlayingMovie = () => {
        this.lastResponse = `${SERVER_PATH}/movie/now_playing?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    }

    getNewestMovie = () => {
        this.lastResponse = `${SERVER_PATH}/movie/upcoming?api_key=${API_KEY}&language=${this.lang}`;
        return this.getData(this.lastResponse);
    }

    // movie card info
    getMovieCard = id => {
        return this.getData(`${SERVER_PATH}/movie/${id}?api_key=${API_KEY}&language=${this.lang}`);
    }

    //=======LAST RESPONSE=======

    getNextPageFromResponses = page => {
        if (this.lastResponse !== "SEARCH") {
            return this.getData(this.lastResponse + `&page=${page}`);
        }
        return this.getSearchResults(undefined, page);
    }
}