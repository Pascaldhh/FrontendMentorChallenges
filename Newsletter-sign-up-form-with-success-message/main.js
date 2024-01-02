class SignUp {
  constructor() {
    this.signUpCard = document.querySelector("#sign-up");
    this.form = document.querySelector("#sign-up-form");
    this.emailInput = this.form.querySelector("#email");
    this.errorLabel = this.form.querySelector("#sign-up-error-label");
    this.validation = [this.errorLabel, this.emailInput];
    this.inputListener = false;
    this.form.addEventListener("submit", this.validate.bind(this));
    
    this.signUpSuccessCard = document.querySelector("#sign-up-success");
    this.dismissBtn = document.querySelector("#dismiss");
    this.dismissBtn.addEventListener("click", this.dismissDialog.bind(this));
  }
  
  validate(event) {
    event.preventDefault();
    !this.emailInput.validity.valid 
    ? this.validation.forEach(item => item.classList.add("has-error"))
    : this.validation.forEach(item => item.classList.remove("has-error"));
    
    if(!this.inputListener) {
      this.emailInput.addEventListener("input", this.validate.bind(this));
      this.inputListener = true;
    }
  
    if(event.type == "submit" && this.emailInput.validity.valid) {
      document.querySelector("#sub-email").textContent = this.emailInput.value;
      this.showDialog();
    }
  }

  cardAnimation(disappear, appear) {
    disappear.classList.add("animation-go-away");
    disappear.addEventListener("animationend", () => { 
      disappear.style.display = "none"; 
      disappear.classList.remove("animation-go-away");
      appear.style.display = "flex"; 
      appear.classList.add("animation-enter");
      appear.addEventListener("animationend", () => {
        appear.classList.remove("animation-enter");
      }, {once: true});
    }, { once: true });
  }

  showDialog() {
    this.cardAnimation(this.signUpCard, this.signUpSuccessCard);
  }

  dismissDialog() {
    this.cardAnimation(this.signUpSuccessCard, this.signUpCard);
    this.reset();
  }

  reset() {
    this.emailInput.value = "";
    this.emailInput.removeEventListener("input", this.validate.bind(this));
  }
}

new SignUp();