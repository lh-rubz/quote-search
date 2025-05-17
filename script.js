// DOM elements
const searchInput = document.getElementById('search-input');
const quotesList = document.getElementById('quotes-list');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const matchesCountElement = document.getElementById('matches-count');
const totalQuotesElement = document.getElementById('total-quotes');

// Store all quotes
let allQuotes = [];

// Fetch quotes from API
async function fetchQuotes() {
    try {
        showLoading();
        
        const response = await fetch('https://dummyjson.com/quotes?limit=50');
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        allQuotes = data.quotes;
        
        hideLoading();
        updateTotalQuotes();
        displayQuotes(allQuotes);
    } catch (error) {
        hideLoading();
        showError(`Error: ${error.message || 'Failed to fetch quotes'}`);
    }
}

// Display quotes in the list
function displayQuotes(quotes) {
    quotesList.innerHTML = '';
    
    if (quotes.length === 0) {
        quotesList.innerHTML = '<div class="no-results">No wisdom found... Keep searching!</div>';
        updateMatchesCount(0);
        return;
    }
    
    quotes.forEach(quote => {
        const li = document.createElement('li');
        li.className = 'quote-item';
        
        li.innerHTML = `
            <div class="quote-text">"${quote.quote}"</div>
            <div class="quote-author">— ${quote.author}</div>
        `;
        
        quotesList.appendChild(li);
    });
    
    updateMatchesCount(quotes.length);
}

// Filter quotes based on search term
function filterQuotes(searchTerm) {
    if (searchTerm.trim() === '') {
        return allQuotes;
    }
      return allQuotes.filter(quote => 
        quote.quote.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Update matches count display
function updateMatchesCount(count) {
    matchesCountElement.textContent = count;
}

// Update total quotes display
function updateTotalQuotes() {
    totalQuotesElement.textContent = allQuotes.length;
}

// Loading state
function showLoading() {
    loadingElement.style.display = 'flex';
    quotesList.innerHTML = '';
    errorElement.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

// Error handling
function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Event listener for search input
searchInput.addEventListener('input', function() {
    const filteredQuotes = filterQuotes(this.value);
    displayQuotes(filteredQuotes);
});

// Fetch quotes when page loads
document.addEventListener('DOMContentLoaded', fetchQuotes);