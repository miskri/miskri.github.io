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

const DBService =
    ((_temp = class DBService {
        constructor() {
            var _this = this;

            _defineProperty(this, "getData", async function (url) {
                return await fetch(url).then(function (resp) {
                    return resp.json();
                });
            });

            _defineProperty(this, "getTestData", function () {
                return _this.getData("test.json");
            });

            _defineProperty(this, "getTestCard", function () {
                return _this.getData("card.json");
            });

            _defineProperty(this, "createDetailedResponse", function (params) {
                let result = `${SERVER_PATH}/discover/${params.category}?api_key=${API_KEY}&language=${_this.lang}`;

                if (params.category === "movie") {
                    if (params.sortBy !== "")
                        result += `&sort_by=${params.sortBy}` + params.sortByType;

                    if (params.withGenres.length > 0) {
                        result += params.withGenres
                            ? `&with_genres=` + params.withGenres.join()
                            : "";
                        result += params.withoutGenres
                            ? `&without_genres=` + params.withoutGenres.join()
                            : "";
                    }

                    result += "&include_adult=" + params.adultContent;

                    if (params.voteCountFilter) {
                        if (params.voteCountGte === -1) params.voteCountGte = "0";
                        if (params.voteCountLte === -1) params.voteCountLte = "99950";
                        result +=
                            `&vote_count.gte=` +
                            params.voteCountGte +
                            `&vote_count.lte=` +
                            params.voteCountLte;
                    }

                    if (params.voteAverageFilter) {
                        if (params.voteAverageGte === -1) params.voteAverageGte = "0";
                        if (params.voteAverageLte === -1) params.voteAverageLte = "10";
                        result +=
                            `&vote_average.gte=` +
                            params.voteAverageGte +
                            `&vote_average.lte=` +
                            params.voteAverageLte;
                    }

                    if (params.runtimeFilter) {
                        if (params.runtimeHoursGte === -1) params.runtimeHoursGte = 0;
                        if (params.runtimeHoursLte === -1) params.runtimeHoursLte = 0;
                        if (params.runtimeMinutesGte === -1) params.runtimeMinutesGte = 0;
                        if (params.runtimeMinutesLte === -1) params.runtimeMinutesLte = 0;
                        let minutes1 =
                            params.runtimeHoursGte * 60 + params.runtimeMinutesGte;
                        let minutes2 =
                            params.runtimeHoursLte * 60 + params.runtimeMinutesLte;
                        result += `&with_runtime.gte=` + minutes1;
                        result += `&with_runtime.lte=` + minutes2;
                    }
                }

                console.log(result); // TODO remove

                return result;
            });

            _defineProperty(
                this,
                "getDetailedSearchResultsMovie",
                async function (response) {
                    _this.lastResponse = response;
                    console.log(_this.lastResponse); // TODO for testing

                    return _this.getData(_this.lastResponse);
                }
            );

            _defineProperty(
                this,
                "getSearchResults",
                async function (query = _this.lastQuery, page = 1) {
                    _this.lastResponse = "SIMPLE_SEARCH";

                    if (page === 1) {
                        _this.lastResults = [];
                    }

                    _this.lastQuery = query;
                    const movieQuery = `${SERVER_PATH}/search/movie?api_key=${API_KEY}&query=${query}&language=${_this.lang}&page=${page}`;
                    const tvQuery = `${SERVER_PATH}/search/tv?api_key=${API_KEY}&query=${query}&language=${_this.lang}&page=${page}`;
                    const responses = [
                        await _this.getData(movieQuery),
                        await _this.getData(tvQuery)
                    ]; // console.log(responses[0].total_results, responses[1].total_results) // TODO for testing

                    const responseFinal = {
                        page: 0,
                        total_results: 0,
                        total_pages: 0,
                        results: []
                    }; // array for last 20-40 results replacing

                    let itemResultsArray = [];
                    responses.forEach(function (item) {
                        if (!item.hasOwnProperty("errors")) {
                            if (item.page > responseFinal.page)
                                responseFinal.page = item.page;
                            responseFinal.total_results += item.total_results;
                            itemResultsArray = itemResultsArray.concat(item.results);
                        }
                    });
                    responseFinal.total_pages = Math.ceil(
                        responseFinal.total_results / 20
                    );
                    let resultsCount = itemResultsArray.length + _this.lastResults.length;

                    if (resultsCount > 20) {
                        itemResultsArray = _this.replaceResults(itemResultsArray);
                        resultsCount = 20;
                    }

                    _this.lastResults = _this.lastResults.concat(itemResultsArray);
                    itemResultsArray = [];

                    for (let i = 0; i < resultsCount; i++) {
                        responseFinal.results[i] = _this.lastResults.shift();
                    } // console.log(responseFinal); // TODO for testing

                    return responseFinal;
                }
            );

            _defineProperty(this, "replaceResults", function (results) {
                let len = results.length - 2;

                for (let i = 0; i < len / 2; i += 2) {
                    [results[i], results[len - i]] = [results[len - i], results[i]];
                }

                return results;
            });

            _defineProperty(this, "shuffleResults", function (results) {
                for (let i = results.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * i);
                    const temp = results[i];
                    results[i] = results[j];
                    results[j] = temp;
                }

                return results;
            });

            _defineProperty(this, "getTrendingDay", function () {
                _this.lastResponse = `${SERVER_PATH}/trending/all/day?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getTrendingWeek", function () {
                _this.lastResponse = `${SERVER_PATH}/trending/all/week?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getTopRatedTv", function () {
                _this.lastResponse = `${SERVER_PATH}/tv/top_rated?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getPopularTv", function () {
                _this.lastResponse = `${SERVER_PATH}/tv/popular?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getWeekTv", function () {
                _this.lastResponse = `${SERVER_PATH}/tv/on_the_air?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getTodayTv", function () {
                _this.lastResponse = `${SERVER_PATH}/tv/airing_today?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getTvCard", function (id) {
                return _this.getData(
                    `${SERVER_PATH}/tv/${id}?api_key=${API_KEY}&language=${_this.lang}`
                );
            });

            _defineProperty(this, "getTopRatedMovie", function () {
                _this.lastResponse = `${SERVER_PATH}/movie/top_rated?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getPopularMovie", function () {
                _this.lastResponse = `${SERVER_PATH}/movie/popular?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getNowPlayingMovie", function () {
                _this.lastResponse = `${SERVER_PATH}/movie/now_playing?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getNewestMovie", function () {
                _this.lastResponse = `${SERVER_PATH}/movie/upcoming?api_key=${API_KEY}&language=${_this.lang}`;
                return _this.getData(_this.lastResponse);
            });

            _defineProperty(this, "getMovieCard", function (id) {
                return _this.getData(
                    `${SERVER_PATH}/movie/${id}?api_key=${API_KEY}&language=${_this.lang}`
                );
            });

            _defineProperty(this, "getNextPageFromResponses", function (page) {
                console.log(_this.lastResponse);
                if (_this.lastResponse === "SIMPLE_SEARCH")
                    return _this.getSearchResults(undefined, page);
                return _this.getData(_this.lastResponse + `&page=${page}`);
            });

            // temporary variable
            this.lang = "en-US";
            this.lastQuery = "";
            this.lastResults = [];
        }
    }),
        _temp);
