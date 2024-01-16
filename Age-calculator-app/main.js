"use strict";

class AgeCalculator {
  constructor(form, inputIds, outputIds, invalidIds) {
    this.birthday;
    this.form = document.getElementById(form);
    this.inputFields = inputIds.map(id => document.getElementById(id));
    this.outputFields = outputIds.map(id => document.getElementById(id));
    this.invalidFields = invalidIds.map(id => document.getElementById(id));

    this.errors = new Proxy({year: null, month: null, day: null}, { set: this.displayErrors.bind(this)});
    this.form.addEventListener("submit", this.submit.bind(this));
  }

  getYears() {
    const today = new Date();
    const birthday = this.birthday;

    let years = today.getFullYear() - this.birthday.getFullYear();
    return today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() 
      && today.getDate() < birthday.getDate())
      ? years-1 : years;
  }

  getMonths() {
    const today = new Date();
    const birthday = this.birthday;

    let months = 12 - (birthday.getMonth()+1);
    return (today.getDate() < birthday.getDate()
      ? months-1 : (months === 12 ? 0 : months)) +1;
  }

  getDays() {
    const today = new Date();
    const birthday = this.birthday;

    const maxDays = new Date(birthday.getFullYear(), birthday.getMonth()+1, 0).getDate();

    return today.getDate() < birthday.getDate() 
      ? maxDays - (birthday.getDate() - today.getDate())
      : today.getDate() - birthday.getDate();
  }

  displayErrors(obj, prop, value) {
    if(value === obj[prop]) return true;
    obj[prop] = value;
   

    const index = Object.keys(obj).indexOf(prop);
    this.invalidFields[index].textContent = value;
    if(value == null) this.inputFields[index].parentElement.classList.remove("invalid-input");
    else this.inputFields[index].parentElement.classList.add("invalid-input");
    return true;
  }

  getAge() {
    return [this.getYears(), this.getMonths(), this.getDays()];
  }

  outputAge() {
    const age = this.getAge();
    this.outputFields.forEach((element, index) => element.textContent = age[index]);
  }

  resetErrors() {
    Object.keys(this.errors).forEach(k => this.errors[k] = null);
  }

  validate(values) {
    const [year, month, day] = values;
    const keys = Object.keys(this.errors);

    const maxDays = new Date(year, month+1, 0).getDate();

    this.resetErrors();
    if(year > (new Date()).getFullYear()) this.errors["year"] = `Must be in the past.`;
    else if(year < 100) this.errors["year"] = `Must be a valid year.`;
    if(month > 12 || month < 1) this.errors["month"] = `Must be a valid month.` 
    if(day > maxDays || day < 1) this.errors["day"] = `Must be a valid day.`

    this.inputFields.forEach((field, index) => {
      if(!field.validity.valid) 
        this.errors[keys[index]] = `This field is required`;
    });
    return Object.values(this.errors).every(item => item == null);
  }

  submit(e) {
    e.preventDefault();
    const values = this.inputFields.map(f => f.value*1);
    if(!this.validate(values)) return;

    this.birthday = new Date(...values);
    this.birthday.setMonth(this.birthday.getMonth()-1);
    this.outputAge();
  }
}

new AgeCalculator(
  "card-form", 
  ["input-year", "input-month", "input-day"],
  ["output-years", "output-months", "output-days"],
  ["invalid-year", "invalid-month", "invalid-day"]
);