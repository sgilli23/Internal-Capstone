/* Author: Samantha Gillison

This is the script for my webpage. */

`use strict`;

// -------- VARIABLES --------- //

// API URL
const databaseURL = `https://gorest.co.in/public/v2/users/`;

// HTML: Drop downs
const byGender = document.getElementById(`byGender`);
const byStatus = document.getElementById(`byStatus`);
const byName = document.getElementById(`byName`);

// HTML: Default values
const genderDefault = document.getElementById(`genDefault`);
const statusDefault = document.getElementById(`statDefault`);
const nameDefault = document.getElementById(`nameDefault`);

// HTML: Buttons
const refreshBtn = document.getElementById(`refreshBtn`);
const resetBtn = document.getElementById(`resetBtn`);
const genderBtn = document.getElementById(`gender`);
const statusBtn = document.getElementById(`status`);
const nameBtn = document.getElementById(`name`);

// HTML: Results
const resultsHead = document.getElementById(`resultsHead`);
const resultsBody = document.getElementById(`resultsBody`);

// JAVASCRIPT: Empties
let selected = ``;
let employees = [];
let personnel = [];
let nameOf = [];
let statusOf = [];
let genderOf = [];

// ---------- FUNCTIONS ---------- //

// ---------- BUTTONS ---------- //
// Buttons = Why? Easier on touch than radio - more accessibility - use prev. job as example

// search by gender
genderBtn.addEventListener(`click`, function (e) {
  byGender.removeAttribute(`disabled`);
  disableBtns();
});

// search by status
statusBtn.addEventListener(`click`, function (e) {
  byStatus.removeAttribute(`disabled`);
  disableBtns();
});

// search by name
nameBtn.addEventListener(`click`, function (e) {
  byName.removeAttribute(`disabled`);
  disableBtns();
});

// refreshes page
refreshBtn.addEventListener(`click`, function (e) {
  e.preventDefault();
  window.location.reload();
});

// resets search
resetBtn.addEventListener(`click`, function (e) {
  e.preventDefault();
  removeData();
  genderDefault.selected = `selected`;
  statusDefault.selected = `selected`;
  nameDefault.selected = `selected`;
  byGender.disabled = `disabled`;
  byStatus.disabled = `disabled`;
  byName.disabled = `disabled`;
  genderBtn.removeAttribute(`disabled`);
  statusBtn.removeAttribute(`disabled`);
  nameBtn.removeAttribute(`disabled`);
});

// disables category buttons
function disableBtns() {
  genderBtn.disabled = `disabled`;
  nameBtn.disabled = `disabled`;
  statusBtn.disabled = `disabled`;
}

// ---------- EMPLOYEE BY NAME --------- //

// grabs employee & displays all their info
const checkName = function (list) {
  list.addEventListener(`change`, (e) => {
    e.preventDefault();
    let selected = event.target.value;
    let filterData = [...personnel].filter(
      (employee) => employee.name === selected
    );
    let person = [...filterData].find((employee) => employee.name);
    removeData();
    resultsHead.textContent = `  🤔 Who is ${selected}? 🤔  `;

    for (const [key, value] of Object.entries(person)) {
      let option = document.createElement("option");
      option.textContent = `${
        key.length > 2 ? capitalizeFirstLetter(`${key}`) : key.toUpperCase()
      }: ${key.length === 6 ? capitalizeFirstLetter(`${value}`) : value} `;

      resultsBody.appendChild(option);
    }
  });
};

// -------- GENDER & STATUS: Search -------- //

// add drop down options data
const createOption = function (key, list) {
  let array = Array.from(new Set([...key]));
  for (element of array) {
    let option = document.createElement(`option`);
    option.textContent = element;
    list.appendChild(option);
  }
};

// cross matches for gender
const checkGender = function (list) {
  list.addEventListener(`change`, (e) => {
    e.preventDefault();
    let selected = event.target.value;
    let filterData = [...personnel].filter(
      (employee) => employee.gender === selected
    );
    createResult(filterData);
    resultsHead.textContent = ` These employees identify as ${selected}:`;
  });
};

// cross matches for status
const checkStatus = function (list) {
  list.addEventListener(`change`, (e) => {
    e.preventDefault();
    let selected = event.target.value;
    let filterData = [...personnel].filter(
      (employee) => employee.status === selected
    );
    createResult(filterData);
    resultsHead.textContent = `These employees are currently shown as ${selected}:`;
  });
};

// -------- GENDER & STATUS: Results -------- //

// displays results
const displayResult = function (data) {
  const iterator = data.values();
  for (const person of iterator) {
    let option = document.createElement(`option`);
    option.textContent = person.name;
    resultsBody.appendChild(option);
  }
};

// ensures empty body to receive results
const createResult = function (data) {
  if (resultsBody.childElementCount === 0) {
    displayResult(data);
  } else {
    removeData();
    displayResult(data);
  }
};

// ------- GRAMMAR POLICE ------- //

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// clears data from body
const removeData = function () {
  while (resultsBody.firstChild) {
    resultsBody.removeChild(resultsBody.firstChild);
  }
  resultsHead.textContent = ``;
};

// get's the API data
const getData = async function () {
  fetch(databaseURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      let employees = data;

      for (const employee of employees) {
        personnel.push(employee);
        nameOf.push(employee.name);
        statusOf.push(employee.status);
        genderOf.push(employee.gender);
      }

      createOption(nameOf, byName);
      createOption(genderOf, byGender);
      createOption(statusOf, byStatus);

      // checkMatch(byGender, genderOf);
      checkName(byName);
      checkStatus(byStatus);
      checkGender(byGender);
    })
    .catch((error) => console.error("FETCH ERROR:", error));
};

// LET'S GO
getData();
