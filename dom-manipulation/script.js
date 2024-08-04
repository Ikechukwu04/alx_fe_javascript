document.addEventListener('DOMContentLoaded', function() {
    const quotesKey = 'quotes';
    const categoryKey = 'selectedCategory';
    let quotes = loadQuotesFromLocalStorage() || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" },
        { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", category: "Wisdom" }
    ];

    // Function to save quotes to local storage
    function saveQuotesToLocalStorage() {
        localStorage.setItem(quotesKey, JSON.stringify(quotes));
    }

    // Function to load quotes from local storage
    function loadQuotesFromLocalStorage() {
        return JSON.parse(localStorage.getItem(quotesKey));
    }

    // Function to save the selected category to local storage
    function saveSelectedCategory(category) {
        localStorage.setItem(categoryKey, category);
    }

    // Function to load the selected category from local storage
    function loadSelectedCategory() {
        return localStorage.getItem(categoryKey);
    }

    // Function to display a random quote
    function showRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
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
                quotes.push({ text: quoteText, category: quoteCategory });
                saveQuotesToLocalStorage();
                updateCategoryOptions();
                alert('Quote added successfully!');
                addQuoteForm.reset();
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
                    quotes = [...quotes, ...importedQuotes];
                    saveQuotesToLocalStorage();
                    updateCategoryOptions();
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

    // Function to update category options in the dropdown
    function updateCategoryOptions() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = '<option value="All">All</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Function to get quotes based on the selected category
    function getFilteredQuotes() {
        const selectedCategory = document.getElementById('category-select').value;
        return selectedCategory === 'All' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    }

    // Function to filter quotes based on the selected category
    function filterQuotes() {
        saveSelectedCategory(document.getElementById('category-select').value);
        showRandomQuote();
    }

    // Initial setup
    createAddQuoteForm();
    updateCategoryOptions();

    const savedCategory = loadSelectedCategory();
    if (savedCategory) {
        document.getElementById('category-select').value = savedCategory;
    }

    showRandomQuote();

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
