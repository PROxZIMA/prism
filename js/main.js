/**
 * Toast Section
 */

const toastsContainer = document.getElementById('toastsContainer');

const toast = (type, message) => {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type} opacity-0`;
  toast.innerHTML = `<p>${message}</p>`;
  toastsContainer.appendChild(toast);

  let time = 1500;
  setTimeout(() => {
    toast.classList.remove('opacity-0');
  }, 1);
  setTimeout(() => {
    toast.classList.add('opacity-0');
    toast.style.margin = 0;
    toast.style.padding = 0;
  }, time);
  setTimeout(() => {
    toast.style.height = 0;
  }, time + 100);
  setTimeout(() => toast.remove(), time + 300);
}




/**
 * Theming Section
 */

let theme = () => document.documentElement.getAttribute('data-theme');

const toogleTheme = (e) => {
  const setTheme = (th) => {
    document.getElementById('theme').checked = (th === 'light') ? true : false;
    document.getElementById('toggleWrapper').title = `Switch to ${(th === 'light') ? 'dark' : 'light'} theme`;
    document.documentElement.setAttribute('data-theme', th);
  };

  if (e)    // For setting default theme on page load
    if (e === 'dark')
      setTheme('dark');
    else
      setTheme('light');
  else if (theme() === 'dark')   // Toogle on button click
    setTheme('light');
  else
    setTheme('dark');

  localStorage.setItem('theme', theme());
};

document.getElementById('theme').addEventListener('click', () => {
  toogleTheme();
  toast('success', `Switched to ${theme()} theme`);
});

var storedTheme = localStorage.getItem('theme');
if (storedTheme === null)
  localStorage.setItem('theme', theme);
else
  toogleTheme(storedTheme);




/**
 * Autocomplete Section
 */

const fetchData = (unique => url =>
  new Promise(response => {
    const script = document.createElement('script');
    const name = `_${unique++}`;

    script.src = `${url}&callback=${name}`;
    window[name] = json => {
      response(new Response(JSON.stringify(json)));
      script.remove();
      delete window[name];
    };

    document.body.appendChild(script);
  })
)(0);

const autocomplete = (inp, arr) => {
  let currentFocus;
  inp.addEventListener('input', function (e) {
    let a, b, i, val = this.value;

    let url = `https://www.google.com/complete/search?client=chrome&q=${encodeURIComponent(val)}`;

    const request = (async () => {
      await (fetchData(url)
        .then(function (response) {
          return response.json()
        }).then(function (json) {
          arr = json[1];
        }).catch(function (ex) {
          console.log('parsing failed', ex)
        })
      );

      closeAllLists();
      if (!val) {
        return false;
      }

      currentFocus = -1;
      a = document.getElementById('autocomplete-items');

      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement('DIV');
          b.setAttribute('class', 'autocomplete-item');
          b.innerHTML = `<strong>${arr[i].substr(0, val.length)}</strong>${arr[i].substr(val.length)}<input type='hidden' value='${arr[i]}'>`;
          b.addEventListener('click', function (e) {
            inp.value = this.getElementsByTagName('input')[0].value;
            document.getElementById('inputBox').focus();
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    })();
  });

  inp.addEventListener('click', function (e) {
    window.scroll({
      top: window.pageYOffset + this.getBoundingClientRect().top - 25,
      behavior: 'smooth'
    });
  });

  inp.addEventListener('keydown', function (e) {
    let x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
      inp.value = x[currentFocus].getElementsByTagName('input')[0].value;
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
      e.preventDefault();
      inp.value = x[currentFocus].getElementsByTagName('input')[0].value;
    } else if (e.keyCode == 13) {
      e.preventDefault();
      let ac = document.getElementsByClassName('autocomplete-active');
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

  const addActive = (x) => {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add('autocomplete-active');
  }

  const removeActive = (x) => {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }

  const closeAllLists = (elmnt) => {
    let x = document.getElementById('autocomplete-items');
    while (x.firstChild) {
      x.firstChild.remove()
    }
  }

  document.addEventListener('click', e => {
    closeAllLists();
  });
}

autocomplete(document.getElementById('inputBox'), []);




/**
 * Engine Section
 */

let logo = document.getElementById('engine');

const toggleEngine = (e) => {
  const setGoogle = () => {
    logo.src = 'icons/google.svg';
    document.getElementById('inputBox').placeholder = 'Search with Google';
    document.getElementsByClassName('search')[0].action = 'https://www.google.com/search';
  };

  const setDDG = () => {
    logo.src = 'icons/duck.svg';
    document.getElementById('inputBox').placeholder = 'Search with Duck Duck Go';
    document.getElementsByClassName('search')[0].action = 'https://duckduckgo.com/';
  };

  if (e)    // For setting default icon on page load
    if (e.includes('duck.svg'))
      setDDG();
    else
      setGoogle();
  else if (logo.src.includes('duck.svg'))   // Toogle on button click
    setGoogle();
  else
    setDDG();

  localStorage.setItem('preferredEngine', logo.src);
}

logo.addEventListener('click', () => toggleEngine());
document.getElementById('inputBox').focus();

let storedLogo = localStorage.getItem('preferredEngine');
if (storedLogo === null)
  localStorage.setItem('preferredEngine', logo.src);
else
  toggleEngine(storedLogo);




/**
 * Links Section
 */

let restore = `[["Hackerrank","https://www.hackerrank.com/"],["CodeChef","https://www.codechef.com/"],["LeetCode","https://leetcode.com/"],["HackerEarth","https://www.hackerearth.com/"],["CodeForces","https://codeforces.com/"],["Python","https://docs.python.org/3/library/index.html"],["C++","https://www.cplusplus.com/doc/tutorial/"],["Github","https://github.com/"],["DevDocs","https://devdocs.io/css/"],["Stackoverflow","https://stackoverflow.com/"],["Youtube","https://www.youtube.com/"],["Drive","https://drive.google.com/drive/u/0/"],["Gmail","https://mail.google.com/mail/u/0/"],["Photos","https://photos.google.com/"],["Reddit","https://www.reddit.com/"],["Spotify","https://open.spotify.com/"],["Soundcloud","https://soundcloud.com/"],["Deezer","https://www.deezer.com/us/"],["Mixcloud","https://www.mixcloud.com/"],["Core Radio","https://coreradio.ru/"],["Behance","https://www.behance.net/"],["Deviantart","https://www.deviantart.com/"],["Unsplash","https://unsplash.com/"],["Dribbble","https://dribbble.com/"],["Tumblr","https://www.tumblr.com/dashboard"]]`

let links = document.getElementsByClassName('link');

[...links].forEach(link => link.spellcheck = false);

const saveLinks = () => {
  let list = [];
  [...links].forEach(link => list.push([link.textContent, link.href]));
  localStorage.setItem('linkList', JSON.stringify(list));
};
if (localStorage.getItem('linkList') === null)
  saveLinks();

const editLink = (state) => {
  [...links].forEach(link => link.contentEditable = state);
  toast('success', `Edit mode ${(state) ? 'ON' : 'OFF'}!!`);
};

const cleanInp = () => {
  var paras = document.getElementsByClassName('inp');
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
};

const loadLinks = (data, tost = true) => {
  let linkList = JSON.parse(localStorage.getItem('linkList'));
  try {
    if (data) {
      data = JSON.parse(data);
      if (
        data.constructor === Array &&
        data.length === 25 &&
        data.every(i => (i.constructor === Array && i.length === 2)))
        linkList = data;
      else
        throw ('Improper import data!!');
    }
    for (let i = 0; i < 25; i++) {
      links[i].textContent = linkList[i][0];
      links[i].href = linkList[i][1];
    }
    if (tost)
      toast('success', 'Links loaded!!');
  }
  catch (err) {
    toast('error', `Improper import data!!`);
    console.log(err, '\nList size should be 25 and should be of type [[,], [,]...]');
    return false;
  }
  saveLinks();
  if (links[0].contentEditable === 'true')
    editLink(false);
  return true;
};
loadLinks(false, false);

[...links].forEach((link) =>
  link.addEventListener('click', function () {
    if (
      link.contentEditable === 'true' &&
      !link.nextSibling
    ) {
      inp = document.createElement('input');
      inp.classList.add('inp');
      inp.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          this.previousElementSibling.href = this.value;
          cleanInp();
        }
      });
      link.parentNode.insertBefore(inp, this.nextSibling);
      inp.value = inp.previousElementSibling.href;
    }
  })
);

document.getElementById('edit').addEventListener('click', () => {
  editLink(true);
  document.getElementById('sidePane').style.right = 0;
});

document.getElementById('save').addEventListener('click', () => {
  saveLinks();
  document.getElementById('sidePane').style = '';
  toast('success', 'Links saved!!');
  if (links[0].contentEditable === 'true')
    editLink(false);
  cleanInp();
});

document.getElementById('import').addEventListener('change', (e) => {
  var reader = new FileReader();
  reader.readAsText(e.target.files[0], 'UTF-8');
  reader.onload = function (e) {
    if (loadLinks(e.target.result, false))
      toast('success', 'Links imported!!');
  }
});

document.getElementById('export').addEventListener('click', () => {
  let str = localStorage.getItem('linkList');
  let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(str);

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', 'data.json');
  linkElement.click();
  toast('success', 'Data exported!!');
});

document.getElementById('restore').addEventListener('click', () => {
  loadLinks(restore, false);
  toast('success', 'Links restored!!');
});

document.addEventListener('click', (e) => {
  if (
    e.target === document ||
    e.target.tagName === 'BODY' ||
    e.target.tagName === 'HTML' ||
    (e.target.classList[0] !== 'link' &&
      e.target.classList[0] !== 'inp')
  )
    cleanInp();
});
