const fs = require('fs')
const path = require('path')

const sizeOf = require('image-size')
const sharp = require('sharp')
const StringBuffer = require('stringbuffer')
const shorthash = require('short-hash')


/*
function galleryCustomTag(nunjucksEngine) {
    return new function() {
        this.tags = ["gallery"];
  
        this.parse = function(parser, nodes, lexer) {
          var tok = parser.nextToken();
  
          var args = parser.parseSignature(null, true);
          parser.advanceAfterBlockEnd(tok.value);
  
          return new nodes.CallExtensionAsync(this, "run", args, []);
        };
  
        this.run = function(context, options, callback) {
          let ret = new nunjucksEngine.runtime.SafeString(
                "this is gallery"
          );
          callback(null, ret);
        };
      }();
}  

module.exports = function(eleventyConfig) {
    eleventyConfig.addNunjucksTag("gallery", galleryCustomTag)
}

*/

function chunks(array, chunk_size) {
    const numRows = Math.round(array.length / chunk_size)   // number of effective rows 
    const itemPerRow = array.length / numRows                // a float

    const result = []
    for (var r = 0; r < numRows; r++) {
        let copy = [...array]
        const v = copy.slice(r * itemPerRow, (r+1)*itemPerRow)
        result.push(v)
    }
    return result
}

function perform_gallery(width, itemsPerRow, padding, callback) {

    const source = "_photos/src"
    const destination = "_photos/thumbnail"

    // list photos
    const photos = fs.readdirSync(source).map(function(item) {
        const size = sizeOf(path.join(source, item))
        return {"filename": item, ...size}
    });

    // compute thumbnail sizes
    const photoRows = chunks(photos, itemsPerRow)

    // compute thumbnails
    photoRows.forEach(row => {
        row.forEach(item => {
            item.alpha1 = 1000.0 / item.height;
        })
        const sum = row.map(item => item.width * item.alpha1).reduce((x, y) => x + y)
        const alpha2 = (width - 2 * padding * row.length) / sum
        row.forEach(item => {
            item.alpha2 = alpha2
            item.thumb_height = Math.round(item.height * item.alpha1 * item.alpha2)
            item.thumb_width = Math.round(item.width * item.alpha1 * item.alpha2)
        })
        const diff = width - (row.map(item => item.thumb_width).reduce((x, y) => x + y) + 2 * padding * row.length)   // difference between width and real width, due to rounding approximations
        for (var i = 0; i < diff; i++) {
            row[i].thumb_width++;
        }
    })

    // generate thumbnails
    photos.forEach(async item => {
        let suffix =  shorthash(item.thumb_width + "x" + item.thumb_height)
        const webpname = item.filename.replace(/\.[^/.]+$/, "-" + suffix + ".webp")
        const jpgname = item.filename.replace(/\.[^/.]+$/, "-" + suffix + ".jpg")
        if (!fs.existsSync(path.join(destination, webpname))) {
            await sharp(path.join(source, item.filename)).resize(item.thumb_width, item.thumb_height).toFile(path.join(destination, webpname))
        }
        if (!fs.existsSync(path.join(destination, jpgname))) {
            await sharp(path.join(source, item.filename)).resize(item.thumb_width, item.thumb_height).toFile(path.join(destination, jpgname))
        }

        item.webpname = webpname
        item.jpgname = jpgname
    })

    // output dummy
    var html = ""
    photoRows.forEach(row => {
        html = html + "<div>"
        row.forEach(item => {
            html = html + `<picture>`
            html = html + `    <source srcset="/gallery/thumbnail/${item.webpname}" type="image/webp" />`
            html = html + `    <source srcset="/gallery/thumbnail/${item.jpgname}" type="image/jpeg" />`
            html = html + `    <img src="/gallery/thumbnail/${item.jpgname}" alt="${item.filename}">`
            html = html + `</picture>`
        })
        html = html + "</div>"
    })
    callback(html)
}


module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy({ "_photos/thumbnail/*": "gallery/thumbnail/" });
    eleventyConfig.addPassthroughCopy({ "_photos/fullsize/*": "gallery/fullsize/" });

    eleventyConfig.addNunjucksTag("gallery", function(nunjucksEngine) {
      return new function() {
        this.tags = ["gallery"];
  
        this.parse = function(parser, nodes, lexer) {
          var tok = parser.nextToken();
  
          var args = parser.parseSignature(null, true);
          parser.advanceAfterBlockEnd(tok.value);

          return new nodes.CallExtensionAsync(this, "run", args);
        };
  
        this.run = function(context, width, itemsPerRow, padding, callback) {
          perform_gallery(width, itemsPerRow, padding, (html) => { callback(null, new nunjucksEngine.runtime.SafeString(html))})
        };
      }();
    });
  };