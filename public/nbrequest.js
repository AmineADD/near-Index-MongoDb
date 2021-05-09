function nbRestaurants(){
    xhr = new XMLHttpRequest();
    xhr.open("GET", "/nbrestau");
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) { 
            document.getElementById("nb").innerHTML =JSON.parse(xhr.responseText).nb;
        }
    }
}