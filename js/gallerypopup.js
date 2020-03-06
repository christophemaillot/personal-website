
function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState != 'loading')
          fn();
      });
    }
}

ready(function() {
    // add a modal panel into the DOM
    const elemDiv = document.createElement('div');
    elemDiv.style.cssText = 'display:none;position:fixed;top:0px;left:0px;width:100%;height:100%;opacity:0.6;z-index:2;background:#000;';
    document.body.appendChild(elemDiv);

    const elemImg = document.createElement('img');
    elemImg.style.cssText = "display:none;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:2;border: 4px solid white;";
    
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            elemDiv.style.display = "none";
            elemImg.style.display = "none";
        }
    };

    elemImg.onclick = function() {
        elemDiv.style.display = "none";
        elemImg.style.display = "none";
    }

    document.body.appendChild(elemImg);

    // register click handler on gallery items
    Array.from(document.getElementsByClassName("galleryitem")).forEach(function(element, index, array) {
        element.onclick = function() {
            elemImg.src =  element.src.replace("thumbnail", "fullsize");
            elemDiv.style.display = "block";
            elemImg.style.display = "block";
        }.bind(element)
    })
})