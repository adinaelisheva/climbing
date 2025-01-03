let logDiv, numSpan, perRouteSection, colorInput, difficultyInput, pctInput, notesInput;

function setup() {
  logDiv = document.querySelector('.log');
  numSpan = logDiv.querySelector('.lognum');
  perRouteSection = logDiv.querySelector('.perRouteValues');
  colorInput = logDiv.querySelector('input.color');
  difficultyInput = logDiv.querySelector('input.difficulty');
  pctInput = logDiv.querySelector('input.pct');
  notesInput = logDiv.querySelector('input.notes');
  logDiv.querySelector('input[type="date"]').value = getTodayDateString();
}

function openLog(routeNum) {
  numSpan.innerText = routeNum;
  const routeDiv = document.querySelector('#id' + routeNum);
  const color = getColorFromClasslist(routeDiv);
  if (color) {
    colorInput.value = color;
    logDiv.setAttribute('originalColor', color);
  } else {
    logDiv.removeAttribute('originalColor');
  }
  const difficulty = routeDiv.getAttribute('difficulty');
  if (difficulty) {
    difficultyInput.value = difficulty;
    logDiv.setAttribute('originalDifficulty', difficulty);
  } else {
    logDiv.removeAttribute('originalDifficulty');
  }
  logDiv.classList.remove('hidden');
}

function closeLog() {
  const routeNum = numSpan.innerText;
  const routeDiv = document.querySelector('#id' + routeNum);
  if (colorInput.value) {
    const curColor = getColorFromClasslist(routeDiv);
    if (curColor && curColor !== colorInput.value) {
      colorInput.classList.remove(curColor);
    }
    routeDiv.classList.add(colorInput.value);
  }
  if (difficultyInput.value) {
    routeDiv.setAttribute('difficulty', difficultyInput.value);
  }
  logDiv.classList.add('hidden');
  const inputsToReset = perRouteSection.querySelectorAll('input');
  for (const i of inputsToReset) {
    i.value = '';
  }
}

function getColorFromClasslist(div) {
  const colors = ["yellow", "green", "red", "blue", "white", "orange", "pink", "purple"];
  for (const c of div.classList) {
    if (colors.indexOf(c) >= 0) {
      return c;
    }
  }
  return null;
}

function getTodayDateString() {
  const d = new Date();
  let month = `${d.getMonth() + 1}`;
  if (month.length === 1) { month = `0${month}`; }
  let date = `${d.getDate()}`;
  if (date.length === 1) { date = `0${date}`; }
  return `${d.getFullYear()}-${month}-${date}`;
}

window.onload = setup;