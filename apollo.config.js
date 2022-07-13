module.exports = {
    client: {
        service: {
            name: "api",
<<<<<<< HEAD
            url: "http://localhost:9090/graphql" // TODO: change this to our endpoint
        },
        includes: ['./components/*.tsx', './components/*.graphql']
            
=======
            url: "http://api.spacex.land/graphql" // TODO: change this to our endpoint
        },
        includes: ["./components/**/*.tsx", "./components/**/*.graphql", "./components/**/*.gql"]
>>>>>>> C5-User-Authentication
    }
};