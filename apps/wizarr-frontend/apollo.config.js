// apollo.config.js
module.exports = {
    client: {
        service: {
            name: "Wizarr Blog",
            url: "https://eu-west-2.cdn.hygraph.com/content/cm794oacz001307w5uvanqvdo/master",
        },
        includes: ["src/**/*.vue", "src/**/*.js"],
    },
};
