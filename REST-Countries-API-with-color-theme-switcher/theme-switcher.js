
const Theme = {
  Dark: 0,
  Light: 1,
}

class ThemeSelector {
  static current = ["Light", 1];
  static nameElement;

  static init() {
    let theme = localStorage.getItem("theme") ?? false;
    if(theme) {
      theme = theme.split(',');
      theme[1] = theme[1]*1;
      this.setTheme(theme); 
    }
  }

  static changeTheme(theme) {
    if(theme == this.current || !Object.values(Theme).includes(theme[1])) return;
    this.setTheme(theme);
  }

  static getTheme(themeValue) {
    for(const [key, value] of Object.entries(Theme))
      if(value == themeValue) return [key, value];
    return ["Light", 1];
  }

  static nextTheme() {
    const themeSize = Object.keys(Theme).length;
    const newTheme = themeSize-1 > this.current[1]
      ? this.current + 1
      : 0;

    return this.getTheme(newTheme);
  }

  static switchTheme() {
    this.changeTheme(this.nextTheme());
  }

  static setTheme(theme) {
    document.documentElement.dataset.theme = theme[0].toLocaleLowerCase();
    this.current = theme;
    if(document.readyState === "complete" || document.readyState === "loaded")
      this.nameElement.textContent = this.nextTheme()[0]
    else addEventListener("DOMContentLoaded", () => this.nameElement.textContent = this.nextTheme()[0]);
    localStorage.setItem("theme", this.current);
  }

  static setToggler(element) {
    element.addEventListener("click", this.switchTheme.bind(this));
  }
}

addEventListener("DOMContentLoaded", () => {
  ThemeSelector.nameElement = document.getElementById("theme-mode");
  ThemeSelector.setToggler(document.getElementById("theme-switcher"));
});
ThemeSelector.init();