'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-03T17:01:17.194Z',
    '2022-03-05T23:36:17.929Z',
    '2022-03-08T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayspassed = calcdaysPassed(new Date(), date);
  console.log(dayspassed);

  if (dayspassed === 0) return `Today`;
  if (dayspassed === 1) return `Yesterday`;
  if (dayspassed <= 7) return `${dayspassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};
//Formating the currency

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMovemets = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovemets}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedMOv = formatCur(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formattedMOv}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedIncome = formatCur(incomes, acc.locale, acc.currency);
  labelSumIn.textContent = `${formattedIncome}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedOut = formatCur(Math.abs(out), acc.locale, acc.currency);
  labelSumOut.textContent = `${formattedOut}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  const formattedInterest = formatCur(interest, acc.locale, acc.currency);
  labelSumOut.textContent = `${formattedOut}`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2.0);
    const sec = String(time % 60).padStart(2.0);
    //in each call ,print remaining
    labelTimer.textContent = `${min}:${sec}`;
    //Decreas 1s

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log to get stared`;
    }
    time--;
    //time equal to 0 ,stop and logout
  };
  //set time to 5min
  let time = 120;
  tick();
  //call timer every sec

  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//FAke always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Experimenting API

//day/month/year

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //Create current date and time ..
    //

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //numeric , long 2-digit
      year: 'numeric', // 2-digits
      // weekday: 'long', //short ,narrow
    };

    const locale = currentAccount.locale;
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    containerApp.style.opacity = 100;
    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOutTimer();

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add transfer dates
    receiverAcc.movementsDates.push(new Date().toISOString());
    currentAccount.movementsDates.push(new Date().toISOString());
    clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      clearInterval(timer);
      timer = startLogOutTimer();
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(23 === 23.0);
console.log(0.1 + 0.3 === 0.3);

//convert string to number
console.log(Number('23'));
console.log(Number(+'23'));

//Parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));
console.log(Number.parseFloat('2.5rem', 10));
console.log(Number.parseInt('    2.5rem', 10));

//IsNan
console.log(Number.isNaN('a'));
console.log(Number.isNaN(+'20x'));

//IsFinite for checking the value is number not string
console.log(Number.isFinite(2));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20x'));

//isinteger

console.log(Number.isInteger(2));
console.log(Number.isInteger('02'));
*/
////////////////////////////////////////////////////math
/*
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(125 ** (1 / 3));

//max
console.log(Math.max(1, 2, 52, 1, 0));
console.log(Math.max(1, 2, '52', 1, 0));

// min
console.log(Math.max(1, 2, '52', 1, 0));
console.log(Math.max(1, 2, '52', 1, 0));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.random());

console.log(Math.random() * 6 + 1);

//Random value function
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1);
console.log(randomInt(0, 10));

//Rounding the integers

console.log(Math.trunc(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

//Floting numbers

console.log(typeof (2.7).toFixed(0));
console.log(+(2.1234).toFixed(2));
*/

///Reminder Opertor****

// console.log(5 % 2);
// labelBalance.addEventListener('click',function(){

//   [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
//     if (i%2 ===0)row.style.backgroundColor = 'orangered'
//     if (i%3 ===0)row.style.backgroundColor = 'blue'

//   })

// })
//
/*
const Diameter = 287_460_000_000;
console.log(Diameter);

const pricecents = 345_99;
console.log(pricecents);

const transferFee1 = 15_00;
const transferFee2 = 1_500;


const PI = 3.14_15
console.log(PI)

console.log(Number('230000'))
*/
/*
//Big Int
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);
console.log(2 ** 53 + 5);

//operatins

console.log(1000n + 1000n);

console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == 20);

console.log(10n / 3n);
*/

///Dates and Time

//create a date;

// const now = new Date();
// console.log(now);

// console.log(new Date('09 2022 16:59:06'));

// console.log(account1.movementsDates[0]);

// console.log(new Date(2037, 10, 15, 23, 5));
// console.log(new Date(2037, 10, 32));

// console.log(new Date(2));

////Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future)

//calculation With dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calcdaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const day1 = calcdaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(day1);

///INtl NUMber

// const num = 3884764.23;
// const options = {
//   style: 'currency', //unit ,currency ,percentage
//   unit: 'kilometer-per-hour',
//   currency: 'EUR',
//   // useGrouping : false
// };

// console.log('US:  ', new Intl.NumberFormat('en-us', options).format(num));
// console.log('US:  ', new Intl.NumberFormat('gu-IN', options).format(num));

///Time out and interval

const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your Pizza🍕 ${ing1} and ${ing2}`),
  5000,
  ...ingredients
);

// console.log();

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//setinvertval

// setInterval(function(){
//   const now = new Date();
//   const sec = now.getSeconds();
//   const min = now.getMinutes();
//   const hour = now.getHours();
//   console.log(`${hour}:${min}:${sec}`)
// },1000)
