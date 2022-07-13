module.exports = {
    client: {
        service: {
            name: "api",
            url: "http://api.spacex.land/graphql" // TODO: change this to our endpoint
        },
        includes: ["./components/**/*.tsx", "./components/**/*.graphql", "./components/**/*.gql"]
    }
};