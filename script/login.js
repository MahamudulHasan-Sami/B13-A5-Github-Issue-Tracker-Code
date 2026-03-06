
const usernameInputId = document.getElementById("usernameInputId");
const passwordInputId = document.getElementById("passwordInputId");
const loginBtnId = document.getElementById("loginBtnId");

loginBtnId.addEventListener("click", ()=>{
    if(usernameInputId.value == 'admin' && passwordInputId.value == 'admin123'){
        window.location.assign("./home.html");
    }else{
        alert("Login Failed");
        return;
    }
})