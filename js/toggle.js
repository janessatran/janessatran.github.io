const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

toggleSwitch.addEventListener('change', switchTheme, false);

function setToggleIcons(theme) {
    if (theme == 'dark') {
        document.querySelector('.sun').style.background = 'url("../img/toggle/sun-white.svg") no-repeat center'
        document.querySelector('.moon').style.background = 'url("../img/toggle/moon-white.svg") no-repeat center'
    } else {
        document.querySelector('.sun').style.background = 'url("../img/toggle/sun.svg") no-repeat center'
        document.querySelector('.moon').style.background = 'url("../img/toggle/moon.svg") no-repeat center'
    }
    document.querySelector('.sun').style.backgroundSize = '100%'
    document.querySelector('.moon').style.backgroundSize = '100%'
}

function switchTheme(e) {
  if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setToggleIcons('dark')
      localStorage.setItem('theme', 'dark'); //add this
  }
  else {
      document.documentElement.setAttribute('data-theme', 'light');
      setToggleIcons('light')
      localStorage.setItem('theme', 'light'); //add this
  }    
}


const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
        setToggleIcons('dark')
    }
}
