document.addEventListener('DOMContentLoaded', function() {
    const quotesKey = 'quotes';
    const categoryKey = 'categoryFilter';
    let quotes = [];

    // Fetch quotes from the mock server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('quotes.json');
            const serverQuotes = await response.json();
            return serverQuotes;
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
            return [];
        }
    }
        // Fetch posts from the JSONPlaceholder API
    async function fetchPostsFromAPI() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const posts = await response.json();
            return posts;
        } catch (error) {
            console.error('Error fetching posts from API:', error);
            return [];
        }
    }

      // Function to submit a new quote to the server
    async function submitQuoteToServer(quote) {
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quote),
            });

            if (!response.ok) {
                throw new Error('Failed to submit quote');
            }

            const data = await response.json();
            console.log('Quote submitted successfully:', data);
            return data; // Return the response from the server
        } catch (error) {
            console.error('Error submitting quote:', error);
        }
    }
    // Sync local quotes with the server
    async function syncQuotesWithServer() {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = loadQuotesFromLocalStorage() || [];
        quotes = resolveConflicts(localQuotes, serverQuotes);
        saveQuotesToLocalStorage();
        populateCategories();
        showRandomQuote();
    }

    // Resolve conflicts between local and server quotes
    function resolveConflicts(localQuotes, serverQuotes) {
        const combinedQuotes = [...serverQuotes];
        localQuotes.forEach(localQuote => {
            if (!serverQuotes.some(serverQuote => JSON.stringify(serverQuote) === JSON.stringify(localQuote))) {
                combinedQuotes.push(localQuote);
            }
        });
        return combinedQuotes;
    }

    // Function to save quotes to local storage
    function saveQuotesToLocalStorage() {
        localStorage.setItem(quotesKey, JSON.stringify(quotes));
    }

    // Function to load quotes from local storage
    function loadQuotesFromLocalStorage() {
        return JSON.parse(localStorage.getItem(quotesKey));
    }

    // Function to save the selected category to local storage
    function savecategoryFilter(category) {
        localStorage.setItem(categoryKey, category);
    }

    // Function to load the selected category from local storage
    function loadcategoryFilter() {
        return localStorage.getItem(categoryKey);
    }

    // Function to display a random quote
    function showRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
        if (filteredQuotes.length === 0) {
            const quoteDisplay = document.getElementById('quote-display');
            quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        const quoteDisplay = document.getElementById('quote-display');
        quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
    }

    // Function to create the form to add new quotes
    function createAddQuoteForm() {
        const formContainer = document.getElementById('form-container');
        formContainer.innerHTML = `
            <h2>Add a New Quote</h2>
            <form id="add-quote-form">
                <input type="text" id="quote-text" placeholder="Quote text" required>
                <input type="text" id="quote-category" placeholder="Category" required>
                <button type="submit">Add Quote</button>
            </form>
        `;

        const addQuoteForm = document.getElementById('add-quote-form');
        addQuoteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const quoteText = document.getElementById('quote-text').value.trim();
            const quoteCategory = document.getElementById('quote-category').value.trim();

            if (quoteText && quoteCategory) {
                // Create a new quote object and add it to the quotes array
                const newQuote = { text: quoteText, category: quoteCategory };
                quotes.push(newQuote);
                saveQuotesToLocalStorage(); // Save updated quotes to local storage
                populateCategories(); // Update categories
                alert('Quote added successfully!');
                addQuoteForm.reset(); // Reset the form
                showRandomQuote(); // Show a random quote after adding
            } else {
                alert('Please enter both the quote text and the category.');
            }
        });
    }

    // Function to export quotes to JSON
    function exportQuotesToJSON() {
        const json = JSON.stringify(quotes, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Function to import quotes from JSON
    function importQuotesFromJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes = [...quotes, ...importedQuotes]; // Add imported quotes
                    saveQuotesToLocalStorage(); // Save to local storage
                    populateCategories(); // Update categories
                    alert('Quotes imported successfully!');
                } else {
                    alert('Invalid JSON format.');
                }
            } catch (error) {
                alert('Error reading the file.');
            }
        };
        reader.readAsText(file);
    }

    // Function to populate category options in the dropdown
    function populateCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        const categoryFilter = document.getElementById('category-select');
       categoryFilter.innerHTML = '<option value="All">All</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        const savedCategory = loadSelectedCategory();
        if (savedCategory) {
            categorySelect.value = savedCategory;
        }
    }

    // Function to get quotes based on the selected category
    function getFilteredQuotes() {
        const categoryFilter = document.getElementById('category-select').value;
        return categoryFilter === 'All' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    }

    // Function to filter quotes based on the selected category
    function filterQuotes() {
        savecategoryFilter(document.getElementById('category-select').value);
        showRandomQuote();
    }

    // Initial setup
    createAddQuoteForm();
    syncQuotesWithServer();

    // Event listener for showing a random quote
    const randomQuoteButton = document.getElementById('show-random-quote');
    randomQuoteButton.addEventListener('click', showRandomQuote);

    // Event listeners for import/export
    const exportButton = document.getElementById('export-quotes');
    exportButton.addEventListener('click', exportQuotesToJSON);

    const importInput = document.getElementById('import-quotes');
    importInput.addEventListener('change', importQuotesFromJSON);

    // Event listener for category selection
    const categorySelect = document.getElementById('category-select');
    categorySelect.addEventListener('change', filterQuotes);
});
