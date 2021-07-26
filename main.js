window.onload = () => {
    document.getElementById('inputBox').focus();

    let storedLogo = localStorage.getItem('preferredEngine');
    if (storedLogo === "null")
        localStorage.setItem('preferredEngine', document.getElementById("engine").src);
    else
        toggleEngine(storedLogo);
};

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;

        var url = "https://corsanywhere.herokuapp.com/http://www.google.com/complete/search?client=chrome&q=" + encodeURIComponent(val);
        //+ "&callback=func";

        /*var req = new XMLHttpRequest();
        req.open('GET', url, false);  // `false` makes the request synchronous
        req.send();
        arr = JSON.parse(req.responseText)[1];*/

        const request = (async () => {
            //const response = await fetch(url);
            const data = await (await fetch(url)).text();
            arr = JSON.parse(data)[1];

            closeAllLists();
            if (!val) {
                return false;
            }

            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);

            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.setAttribute("class", "autocomplete-item");
                    b.innerHTML = `<strong>${arr[i].substr(0, val.length)}</strong>${arr[i].substr(val.length)}<input type='hidden' value='${arr[i]}'>`;
                    b.addEventListener("click", function(e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        document.getElementById('inputBox').focus();
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        })();
    });
    inp.addEventListener("click", function(e) {
        window.scroll({
            top: window.pageYOffset + this.getBoundingClientRect().top - 25,
            behavior: 'smooth'
        });
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
            inp.value = x[currentFocus].getElementsByTagName("input")[0].value;
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
            e.preventDefault();
            inp.value = x[currentFocus].getElementsByTagName("input")[0].value;
        } else if (e.keyCode == 13) {
            e.preventDefault();
            var ac = document.getElementsByClassName("autocomplete-active");
            if (ac.length > 0) {
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
            else {
                this.form.submit();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

autocomplete(document.getElementById("inputBox"), []);

function toggleEngine(x) {
    var logo = document.getElementById("engine").src;

    const setGoogle = () => {
        document.getElementById("engine").src = "icons/google.svg";
        document.getElementById("inputBox").placeholder = "Search with Google";
        document.getElementsByClassName("search")[0].action = "https://www.google.com/search";    
    };

    const setDDG = () => {
        document.getElementById("engine").src = "icons/duck.svg";
        document.getElementById("inputBox").placeholder = "Search with Duck Duck Go";
        document.getElementsByClassName("search")[0].action = "https://duckduckgo.com/";
    };

    if (x)
        if (x.includes("duck.svg")) setDDG();
        else setGoogle(); 
    else if (logo.includes("duck.svg")) setGoogle();
    else setDDG();

    localStorage.setItem('preferredEngine', document.getElementById("engine").src);
}
