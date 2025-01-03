let climbsDiv, logDiv, numSpan, dateInput, perRouteSection, colorInput, difficultyInput, pctInput, companionsInput, notesInput;

function setup() {
  fetchAndUpdateRouteInfo();
  fetchAndUpdateClimbs();

  climbsDiv = document.querySelector('.climbs');

  // Set up logging
  logDiv = document.querySelector('.log');
  numSpan = logDiv.querySelector('.lognum');
  dateInput = logDiv.querySelector('input[type="date"]');
  perRouteSection = logDiv.querySelector('.perRouteValues');
  colorInput = logDiv.querySelector('input.color');
  difficultyInput = logDiv.querySelector('input.difficulty');
  pctInput = logDiv.querySelector('input.pct');
  companionsInput = logDiv.querySelector('input.companions');
  notesInput = logDiv.querySelector('input.notes');
  dateInput.value = getTodayDateString();
}

function openClimbs() {
  climbsDiv.classList.remove('hidden');
}

function closeClimbs() {
  climbsDiv.classList.add('hidden');
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
  const newColor = colorInput.value;
  const newDiff = difficultyInput.value;
  if (newColor) {
    const curColor = getColorFromClasslist(routeDiv);
    if (curColor && curColor !== newColor) {
      colorInput.classList.remove(curColor);
    }
    routeDiv.classList.add(newColor);
  }
  if (newDiff) {
    routeDiv.setAttribute('difficulty', newDiff);
  }
  if (newColor !== logDiv.getAttribute('originalColor') ||
      newDiff !== logDiv.getAttribute('originalDifficulty')) {
    updateRoute(routeNum, newColor, newDiff);
  }
  logDiv.classList.add('hidden');
  const inputsToReset = perRouteSection.querySelectorAll('input');
  for (const i of inputsToReset) {
    i.value = '';
  }
}

async function fetchAndUpdateClimbs() {
  const climbs = await fetchEndpoint('fetchclimbs');
  const dialogDiv = climbsDiv.querySelector('.dialog');
  const climbsByDate = {};
  for (c of climbs) {
    dateIndex = Number(c.date.replaceAll('-',''));
    if (!climbsByDate[dateIndex]) {
      climbsByDate[dateIndex] = {date: c.date, companions: c.companions, climbs: []};
    }
    climbsByDate[dateIndex].climbs.push({routenum: c.routenum, pct: c.pct, notes: c.notes});
  }
  for(let k of Object.keys(climbsByDate).sort()) {
    const climb = climbsByDate[k];
    const h = document.createElement('h3');
    h.innerText = `${climb.date} (${climb.companions})`
    dialogDiv.appendChild(h);
    for (let c of climb.climbs) {
      const d = document.createElement('div');
      // TODO - log the route color + difficulty too bc it'll change
      d.innerText = `[Color] [diff] (${c.routenum}): ${c.pct}%`;
      if (c.notes) {
        d.innerText += ` - ${c.notes}`;
      }
      dialogDiv.appendChild(d);
    }
  }
}

async function fetchAndUpdateRouteInfo() {
  const routeInfo = await fetchEndpoint('fetchroutes');
  for (const info of routeInfo) {
    const routeDiv = document.querySelector(`#id${info.routenum}`);
    if (!routeDiv) { continue; }
    if (info.color) { routeDiv.classList.add(info.color); }
    if (info.difficulty) { routeDiv.setAttribute('difficulty', info.difficulty); }
  }
}

function submitLog() {
  // TODO - log the route color + difficulty too bc it'll change
  logClimb(numSpan.innerText, dateInput.value, pctInput.value, companionsInput.value, notesInput.value);
  closeLog();
}

function updateRoute(routenum, color, difficulty) {
  if (!routenum || !color || !difficulty) {
    // console.log(`routenum (${routenum}), color (${color}), and difficulty (${difficulty}) must all be defined to update a route`);
    return;
  }

  fetchEndpoint('update', `routenum=${routenum}&color=${color}&difficulty=${difficulty}`);
}

function logClimb(routenum, date, pct, companions, notes) {
  if (!routenum || !date || !pct) {
    // console.log(`routenum (${routenum}), date (${date}), and pct (${pct}) must all be defined to log a climb`);
    return;
  }
  fetchEndpoint('logclimb', `routenum=${routenum}&date=${date}&pct=${pct}&companions=${companions}&notes=${notes}`);
}

async function fetchEndpoint(endpoint, body) {
  // console.log(`fetching ${endpoint}`);
  const response = await fetch(`/climbing/${endpoint}.php`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: "POST",
    body: body,
  });
  const responseBody = await response.text();
  // console.log(responseBody);
  return JSON.parse(responseBody);
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