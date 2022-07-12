module.exports = {
    client: {
        service: {
            name: "api",
            url: "http://localhost:9090/graphql" // TODO: change this to our endpoint
        },
        includes: ['./components/*.tsx', './components/*.graphql']
            
    }
};