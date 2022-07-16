module.exports = {
    client: {
        service: {
            name: "backend-api",
            url: "http://localhost:9090/graphql" // TODO: change this to our endpoint
        },
        includes: ["./src/**/*.graphql","./components/**/*.tsx", "./components/**/*.graphql", "./components/**/*.gql"]
    }
};