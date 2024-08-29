
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const upperCheck = document.querySelector("#uppercase");
const lowerCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]"); 
const symbols = '~!@#$%^&*()_+`[]\{}|;:<>,.?/';


let password = ""; 
let passwordLength = 10; 
let checkCount = 0;

handleslider();

setIndicator("#ccc");

// set password length -- handleslider()
function handleslider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// set the indicator color and box-shadow -- setIndicator()
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // boxshadow
    indicator.style.boxShadow = "5px 5px 5px black"; 
}

// get random integer between min and max -- getRandomInteger()
function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min 
}

// generate randon number -- generateRandomNumber()
function generateRandomNumber(){
    return getRandomInteger(0,9);
}

// generate random lowercase -- generateLowerCase()
function generateLowercaseLetter(){
    return String.fromCharCode(getRandomInteger(97,123));
}

// generate random uppercase -- generateUpperCase()
function generateUppercaseLetter(){
    return String.fromCharCode(getRandomInteger(65,91));
}

// function to get random symbols
function generateSymbols() {
    const randomNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNumber);
}

// calculate the strength of password  
function calculateStrength() {
    let hasNum = false;
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;

    if (upperCheck.checked)  hasUpper = true;
    
    if (lowerCheck.checked) hasLower = true;

    if (numbersCheck.checked) hasNum = true;

    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

// function to copy password
async function copyPassword() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied!";
    }
    catch(e) {
        copyMsg.innerText = "failed!";
    }

    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// adding event listner on slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleslider();
})

// adding event listner on copy btn
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyPassword();
    }
})

// function to handle check box change or maintain checkbox count
function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special condition 
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleslider;
    }
}


// adding event listner on all checkbox
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})


// adding event listner on generate password button
generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected 
    if (checkCount <= 0) {
        return ;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleslider;
    }

    password = "";

   
    let functionArray = [];
    if (upperCheck.checked) {
        functionArray.push(generateUppercaseLetter);
    }

    if (lowerCheck.checked) {
        functionArray.push(generateLowercaseLetter);
    }

    if (numbersCheck.checked) {
        functionArray.push(generateRandomNumber);
    }

    if (symbolsCheck.checked) {
        functionArray.push(generateSymbols);
    }

    // compulsory additon of password 
    for (let i=0; i<functionArray.length; i++) {
        password += functionArray[i]();
    }

    // remaining addition 
    for (let i=0; i<passwordLength-functionArray.length; i++) {
        let randomIndex = getRandomInteger(0, functionArray.length);
        password += functionArray[randomIndex]();
    }

    // shuffle the password 
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // call calculate password strength function
    calculateStrength();
    
});  

// function to shuffle the password
function shufflePassword(array) {
    //  Fisher Yates Method
    for (let i=array.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    let str = "";
    array.forEach((el) => {
        str += el;
    })

    return str;
}

