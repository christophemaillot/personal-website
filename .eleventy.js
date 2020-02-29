const gallery = require('./_lib/gallery')

module.exports = function(eleventyConfig) {

    eleventyConfig.addPlugin(gallery);

    return {
        dir: {
            data: "_data"
        },
        templateFormats: ["njk", "html", "jpg", "png", "css"]
    }
};