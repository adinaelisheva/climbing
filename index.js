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

  const companionsCookie = getCookie('companions');
  if (companionsCookie) {
    companionsInput.value = companionsCookie;
  }
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
  if (companionsInput.value) {
    document.cookie = `companions=${companionsInput.value};max-age=21600`; // 6 hours 
  }
  logDiv.classList.add('hidden');
  const inputsToReset = perRouteSection.querySelectorAll('input');
  for (const i of inputsToReset) {
    i.value = '';
  }
}

async function fetchAndUpdateClimbs() {
  const climbs = await fetchEndpoint('fetchclimbs');
  const climbsByDate = {};
  for (c of climbs) {
    dateIndex = Number(c.date.replaceAll('-',''));
    if (!climbsByDate[dateIndex]) {
      climbsByDate[dateIndex] = {date: c.date, companions: c.companions, climbs: []};
    }
    climbsByDate[dateIndex].climbs.push({routenum: c.routenum, pct: c.pct, notes: c.notes, color: c.color, difficulty: c.difficulty});
  }
  for(let k of Object.keys(climbsByDate).sort().reverse()) {
    const climb = climbsByDate[k];
    const container = createClimbsDateContainer(climb.date, climb.companions);
    climbsDiv.querySelector('.dialog').appendChild(container);
    for (let c of climb.climbs) {
      createAndAppendClimb(container, c.color, c.difficulty, c.routenum, c.pct, c.notes)
    }
  }
}

function createClimbsDateContainer(date, companions) {
  const container = document.createElement('div');
  container.setAttribute('date', date);
  const h = document.createElement('h3');
  // Switch from yyyy-mm-dd to mm/dd
  const dateStr = date.substring(date.indexOf('-') + 1).replace('-','/');
  h.innerText = `${dateStr} (${companions})`
  container.appendChild(h);
  return container;
}

function createAndAppendClimb(container, color, difficulty, routenum, pct, notes) {
  const d = document.createElement('div');
  d.innerText = `${color} 5.${difficulty} (${routenum}): ${pct}%`;
  if (notes) {
    d.innerText += ` - ${notes}`;
  }
  container.appendChild(d);
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
  logClimb(numSpan.innerText, dateInput.value, pctInput.value, colorInput.value, difficultyInput.value, companionsInput.value, notesInput.value);
  addClimbToClimbsDialog();
  closeLog();
}

function addClimbToClimbsDialog() {
  let container = document.querySelector(`[date='${dateInput.value}'`);
  if (!container) {
    container = createClimbsDateContainer(dateInput.value, companionsInput.value);
  }
  const nextSibling = document.querySelector('.climbs .dialog > div');
  nextSibling.parentNode.insertBefore(container, nextSibling);
  createAndAppendClimb(container, colorInput.value, difficultyInput.value, numSpan.innerText, pctInput.value, notesInput.value);
}

function updateRoute(routenum, color, difficulty) {
  if (!routenum || !color || !difficulty) {
    console.log(`routenum (${routenum}), color (${color}), and difficulty (${difficulty}) must all be defined to update a route`);
    return;
  }

  hitEndpoint('update', `routenum=${routenum}&color=${color}&difficulty=${difficulty}`);
}

function logClimb(routenum, date, pct, color, difficulty, companions, notes) {
  if (!routenum || !date || !pct || !color || !difficulty) {
    console.log(`routenum (${routenum}), date (${date}), pct (${pct}), color (${color}), and difficulty (${difficulty}) must all be defined to log a climb`);
    return;
  }
  let body = `routenum=${routenum}&date=${date}&pct=${pct}&color=${color}&difficulty=${difficulty}`;
  if (companions) {
    body += `&companions=${companions}`;
  }
  if (notes) {
    body += `&notes=${notes}`;
  }
  hitEndpoint('logclimb', body);
}

async function fetchEndpoint(endpoint, body) {
  const response = await hitEndpoint(endpoint, body);
  return JSON.parse(response);
}

async function hitEndpoint(endpoint, body) {
  // console.log(`fetching ${endpoint}`);
  if (body) {
    body = body.replaceAll('+', '%2B');
  }
  const response = await fetch(`/climbing/${endpoint}.php`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: "POST",
    body: body,
  });
  const responseBody = await response.text();
  let error;
  // No guarantee the response will be JSON parseable, but an error should be
  try {
    const parsed = JSON.parse(responseBody);
    error = parsed.Error;
  } catch {}
  if (error) {
    console.log(`Server Error: ${error}`);
  }
  // console.log(responseBody);
  return responseBody;
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

function getCookie(key) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`))
    ?.split("=")[1];
}

window.onload = setup;