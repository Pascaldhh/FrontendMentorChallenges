class AgeCalculator {
  constructor(btnId, inputIds) {
    this.btn = document.getElementById(btnId);
    this.birthday;
    this.inputFields = inputIds.map(id => document.getElementById(id));
    
    this.btn.addEventListener("click", this.click.bind(this));
  }

  getYear() {
    const year = new Date().getFullYear() - this.birthday.getFullYear();
  }

  getMonth() {
    return Math.abs(new Date().getMonth() - this.birthday.getMonth());
  }

  getDay() {
    return Math.abs(new Date().getDay() - this.birthday.getDay());
  }

  getAge() {
    return [this.getYear(), this.getMonth(), this.getDay()];
  }

  click() {
    const values = this.inputFields.map(f => f.value);
    this.birthday = new Date(...values);
    console.log(this.getAge());
  }
}

new AgeCalculator("btn-calculate", ["year", "month", "day"]);