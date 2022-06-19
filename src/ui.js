import './ui.css';

const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const themeBtn = document.querySelector('.btn-toggle');
const scoreBtn = document.getElementsByClassName('score-toggle');

// Assigns an onclick function to the Show Score/Grade buttons
for (let btn of scoreBtn) {
  btn.onclick = () => switchPanel(1);
}

if (dark) document.body.classList.add('dark-theme');

// Assigns an onclick function the the toggle theme button
themeBtn.onclick = () => toggleTheme();

// Function for toggling light/dark theme
const toggleTheme = () => {
  document.body.classList.toggle('dark-theme');

  const isDark = document.body.classList.contains('dark-theme');

	// Sends a message to figma.ui with the current theme
	// parent.postMessage(
	//   {
	//     pluginMessage: {
	//       type: 'theme-change',
	//       theme: isDark ? 'dark' : 'light'
	//     }
	//   },
	// 	'*'
	// );
};

// Don't need this whilst using Emoji for scoring a number
// const changeDisplayFontSize = size => {
//   const scoreStyle = document.getElementById('display').style;
//   const gradeStyle = document.getElementById('age-display').style;

//   scoreStyle.fontSize = size;
//   gradeStyle.fontSize = size;
// };

// This runs every time window.onmessage receives a message from figma
onmessage = event => {
  const msg = event.data.pluginMessage;
  const justNumbers = "I can't do numbers :(";

	// Sets theme on load
  if (msg.type === 'theme' && msg.theme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  if (msg.type === 'selection') {
		/// /////
		// I apologise for this hacky workaround that doesn't even really need to exist.
		// msg.score === justNumbers
		// 	? changeDisplayFontSize('1.5em')
		// 	: changeDisplayFontSize('3em');
		/// ////

    console.log('got this from the plugin code', msg);
    document.getElementById('display').innerText = msg.score;
    document.getElementById('age-display').innerHTML = msg.age;
    const decriptions = document.getElementsByClassName('description');

    for (let text of decriptions) {
      text.innerHTML = msg.description;
    }
  }
};

// Logic for switching between score and grade
let slideIndex = 1;

// Next/previous controls
const switchPanel = n => {
  showPanels((slideIndex += n));
};

const showPanels = n => {
  const panels = document.getElementsByClassName('container');
  if (n > panels.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = panels.length;
  }

  for (let panel of panels) panel.style.display = 'none';
  panels[slideIndex - 1].style.display = 'flex';
};

showPanels(slideIndex);
