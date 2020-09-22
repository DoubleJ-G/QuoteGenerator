// CONST Values

const MAX_RETRY = 3;

//DOM Elements
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

function showLoader() {
	loader.hidden = false;
	quoteContainer.hidden = true;
}

function showQuote() {
	if (!loader.hidden) {
		quoteContainer.hidden = false;
		loader.hidden = true;
	}
}

// Get Quote From API
async function getQuote(tries = 0) {
	showLoader();
	const PROXY = 'https://cors-anywhere.herokuapp.com/';
	const URL =
		'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
	try {
		const response = await fetch(PROXY + URL);
		const data = await response.json();

		if (data.quoteText === quoteText.innerText) {
			throw new Error('Got same quote, retrying');
		}

		// If blank author add 'Unknown'
		authorText.innerText === '' ? 'Unknown' : data.quoteAuthor;
		// Shrink if text is too long
		if (data.quoteText.length > 120) {
			quoteText.classList.add('long-quote');
		} else {
			quoteText.classList.remove('long-quote');
		}
		quoteText.innerText = data.quoteText;
	} catch (error) {
		if (tries < MAX_RETRY) {
			getQuote(tries + 1);
		}
		console.log('Error retrieving quote', error);
	}
	showQuote();
}

// Tweet Quote
function tweetQuote() {
	const quote = quoteText.innerText;
	const author = authorText.innerText;
	const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
	window.open(twitterUrl, '_blank');
}

// Event Listeners

newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
// On Load

showLoader();
getQuote();
