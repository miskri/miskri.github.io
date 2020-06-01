const DBService = class {

    getData = async (url) => {
        const response = await fetch(url);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Can not get data from url ${url}`);
        }
    }

    getTestData = () => {
        return this.getData("test.json");
    }

    getTestCard = () => {
        return this.getData("card.json");
    }

    getTopRatedTv = () => {
        // temporary variable
        let lang = "ru-RU";
        this.lastResponse = `${SERVER_PATH}/tv/top_rated?api_key=${API_KEY}&language=${lang}`;
        return this.getData(this.lastResponse);
    }

    getPopularTv = () => {
        // temporary variable
        let lang = "ru-RU";
        this.lastResponse = `${SERVER_PATH}/tv/popular?api_key=${API_KEY}&language=${lang}`;
        return this.getData(this.lastResponse);
    }

    getWeekTv = () => {
        // temporary variable
        let lang = "ru-RU";
        this.lastResponse = `${SERVER_PATH}/tv/on_the_air?api_key=${API_KEY}&language=${lang}`;
        return this.getData(this.lastResponse);
    }

    getTodayTv = () => {
        // temporary variable
        let lang = "ru-RU";
        this.lastResponse = `${SERVER_PATH}/tv/airing_today?api_key=${API_KEY}&language=${lang}`;
        return this.getData(this.lastResponse);
    }

    getSearchResultTv = (query) => {
        // temporary variable
        let lang = "ru-RU";
        this.lastResponse = `${SERVER_PATH}/search/tv?api_key=${API_KEY}&query=${query}&language=${lang}`;
        return this.getData(this.lastResponse);
    }

    getTvCard = id => {
        // temporary variable
        let lang = "ru-RU";
        return this.getData(`${SERVER_PATH}/tv/${id}?api_key=${API_KEY}&language=${lang}`);
    }

    getPageFromLastResponse = page => {
        return this.getData(this.lastResponse + `&page=${page}`);
    }
}