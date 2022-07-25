module.exports = {
    client: {
        service: {
            name: "backend-api",
            url: "https://backend.ps4.bornais.ca/graphql" // TODO: change this to our endpoint
        },
        includes: ["./src/**/*.graphql", "./components/**/*.tsx", "./components/**/*.graphql", "./components/**/*.gql"]
    }
};