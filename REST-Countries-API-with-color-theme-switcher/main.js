class Country {
  constructor(flags, name, nativeName, population, region, subRegion, capital, topLevelDomain, currencies, languages, borderCountries) {
    this.flags = flags;
    this.name = name;
    this.nativeName = nativeName;
    this.population = population;
    this.region = region;
    this.subRegion = subRegion;
    this.capital = capital;
    this.topLevelDomain = topLevelDomain;
    this.currencies = currencies;
    this.languages = languages;
    this.borderCountries = borderCountries;
  }

  static async all() {
    let response = await fetch("https://restcountries.com/v3.1/all");
    
    let isDataJson = false;
    if(response.status != 200) {
      response = await fetch("/REST-Countries-API-with-color-theme-switcher/data.json");
      isDataJson = true;
    }
    
    const json = await response.json();

    const countries = [];
    for(const index in json) {
      countries.push(new Country(
        json[index]?.flags,
        !isDataJson ? json[index]?.name?.common : json[index]?.name, 
        json[index]?.name?.nativeName?.eng?.official, 
        json[index]?.population,
        json[index]?.region,
        json[index]?.subregion,
        json[index]?.capital,
        !isDataJson ? json[index]?.tld : json[index]?.topLevelDomain,
        json[index].currencies != null 
          ? Object.values(json[index].currencies).map(item => item.name)
          : ["None"],
        !isDataJson 
          ? json[index].languages != null
            ? Object.values(json[index].languages)
            : ["None"]
          : json[index].languages != null
            ? json[index].languages.map(item => item?.name)
            : ["None"],
        !isDataJson 
          ? json[index].borders != null 
            ? json[index].borders.map(border => json.filter(country => country.cca3 != null && country.cca3.toLowerCase() == border.toLowerCase())[0]?.name?.common)
            : []
          : json[index].borders != null
            ? json[index].borders.map(border => json.filter(country => country.alpha3Code != null && country.alpha3Code.toLowerCase() == border.toLowerCase())[0]?.name)
            : []) 

          
      );
    }

    return countries;
  }

  static async get(official) {
    const countries = await Country.all();
    let country = countries.filter(country => country.name == official)[0] ?? null;
    return country;
  }

  countryCard() {
    return `
    <a href="./country/?name=${this.name}" class="country">
      <img class="country__image" src="${this.flags.svg}" alt="Country flag of ${this.nativeName}"/>
      <div class="country__content">
        <h2 class="country__title">${this.name}</h2>
        <div class="country__description">
          <p><span class="fw-bold">Population:</span> ${this.population.toLocaleString()}</p>
          <p><span class="fw-bold">Region:</span> ${this.region}</p>
          <p><span class="fw-bold">Capital:</span> ${this.capital}</p>
        </div>
      </div>
    </a>`;
  }

  countryInfoCard() {
    return `
    <img class="country-info__image" src="${this.flags.svg}" alt="Country flag of ${this.nativeName}">
    <div class="country__group">
      <h2 class="country-info__title">${this.name}</h2>
      <div class="country-info__side-by-side">
        <div class="country-info__group first">
          <p><span class="fw-bold">Native Name:</span> ${this.name}</p>
          <p><span class="fw-bold">Population:</span> ${this.population.toLocaleString()}</p>
          <p><span class="fw-bold">Region:</span> ${this.region}</p>
          <p><span class="fw-bold">Sub Region:</span> ${this.subRegion}</p>
          <p><span class="fw-bold">Capital:</span> ${this.capital}</p>
        </div>
        <div class="country-info__group second">
          <p><span class="fw-bold">Top Level Domain:</span> ${this.topLevelDomain}</p>
          <p><span class="fw-bold">Currencies:</span> ${this.currencies.join(', ')}</p>
          <p><span class="fw-bold">Languages:</span> ${this.languages.join(', ')}</p>
        </div>
      </div>
      <div class="country-info__border-countries">
        <p><span class="fw-bold">Border Countries:</span></p>
        ${this.borderCountries.map(item => `<a href="../country/?name=${item}" class="country-info__border-countries-border">${item}</a>`).join('')}
      </div>
    </div>
    `;
  }
}

class Countries {
  constructor(countries, countryContainer, regionContainer, searchBar) {
    this.url = new URL(window.location);

    this.regions = [];
    this.countries = countries;

    this.countryContainer = countryContainer;
    this.regionContainer = regionContainer;
    this.searchBar = searchBar;

    this.generateRegions();
    this.activeRegion = this.validateRegion(this.url.searchParams.get("region"));
    this.updateRegionUrl();

    this.searchQuery = this.url.searchParams.get("search") ?? null;
    this.searchBar.value = this.searchQuery;
    this.searchForCountry(this.searchQuery);
    
    this.generateCards();
    this.regionContainer.addEventListener("change", this.filterByRegion.bind(this));
    this.searchBar.addEventListener("input", this.searchEvent.bind(this));
  }

  generateCards() {
    const html = [];
    if(this.shownCountries.length > 0) this.shownCountries.forEach(country => html.push(country.countryCard()));
    else html.push("<h2>No countries found</h2>")
    this.countryContainer.innerHTML = html.join('');
  }

  generateRegions() {
    this.countries.forEach(country => {
      if(!this.regions.includes(country.region)) 
        this.regions.push(country.region);
    });
    this.regions.sort();
    this.regions.forEach(region => this.regionContainer.add(new Option(region, region)))
  }

  countriesByRegion() {
    return this.activeRegion 
      ? this.countries.filter(country => country.region == this.activeRegion) 
      : this.countries;
  }

  searchBarPlaceholderText(region) {
    return region 
      ? `Search for a country in region ${this.activeRegion}...`
      : `Search for a country...`;
  }

  validateRegion(region) {
    return this.regions.includes(region) 
      ? region
      : null;
  }

  updateRegionUrl() {
    this.activeRegion 
      ? this.url.searchParams.set("region", this.activeRegion)
      : this.url.searchParams.delete("region");
    window.history.pushState({}, "", this.url);
  }

  updateSearchUrl() {
    this.searchQuery 
      ? this.url.searchParams.set("search", this.searchQuery)
      : this.url.searchParams.delete("search")
    window.history.pushState({}, "", this.url);
  }

  filterByRegion(event) {
    this.activeRegion = this.validateRegion(event.target.value);
    this.updateRegionUrl();

    this.resetSearchBar();
    this.searchBar.placeholder = this.searchBarPlaceholderText(this.activeRegion);
    this.shownCountries = this.countriesByRegion(this.activeRegion);
    this.generateCards();
  }

  searchEvent(event) {
    this.searchForCountry(event.target.value);
    this.updateSearchUrl();
    this.generateCards();
  }

  resetSearchBar() {
    this.searchBar.value = "";
    this.searchQuery = "";
    this.updateSearchUrl();
  }

  searchForCountry(value) {
    this.searchQuery = value;
    if(value != null) this.shownCountries = this.countriesByRegion()
      .filter(country => country.name.toLowerCase().includes(value.toLowerCase()));
    else this.shownCountries = this.countriesByRegion();
  }
}


if(!window.location.pathname.includes("country")) {
  new Countries(
    await Country.all(),
    document.getElementById("country-container"),
    document.getElementById("filter-by-region"),
    document.getElementById("search-bar")
  );
} else {
  const container = document.getElementById("country-info-container");
  const country = await Country.get(new URL(window.location).searchParams.get("name"));
  container.innerHTML = country != null ? country.countryInfoCard() : `<h2>No country found</h2>`;
}
