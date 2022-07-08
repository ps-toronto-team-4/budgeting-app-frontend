module.exports = {
    client: {
        service: {
            includes: ['./components/*.tsx', './src/*.graphql'],
            name: "api",
            url: "http://api.spacex.land/graphql" // TODO: change this to our endpoint
        }
    }
};