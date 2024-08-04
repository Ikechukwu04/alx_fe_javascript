document.addEventListener('DOMContentLoaded', function() {
    const addNoteButton = document.getElementById('add-note');
    const notesList = document.getElementById('notes-list');
    const newNoteInput = document.getElementById('new-note');

    // Function to create a new note element
    function createNoteElement(noteText) {
        const listItem = document.createElement('li');

        const noteSpan = document.createElement('span');
        noteSpan.textContent = noteText;
        listItem.appendChild(noteSpan);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-note');
        editButton.addEventListener('click', function() {
            if (editButton.textContent === 'Edit') {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = noteSpan.textContent;
                listItem.insertBefore(input, noteSpan);
                listItem.removeChild(noteSpan);
                editButton.textContent = 'Save';
                input.focus();
            } else {
                const input = listItem.querySelector('input');
                noteSpan.textContent = input.value;
                listItem.insertBefore(noteSpan, input);
                listItem.removeChild(input);
                editButton.textContent = 'Edit';
            }
        });
        listItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-note');
        deleteButton.addEventListener('click', function() {
            notesList.removeChild(listItem);
        });
        listItem.appendChild(deleteButton);

        return listItem;
    }

    // Function to add a new note
    function addNote() {
        const noteText = newNoteInput.value.trim();
        if (noteText === '') {
            alert('Please enter a note.');
            return;
        }

        const listItem = createNoteElement(noteText);
        notesList.appendChild(listItem);

        newNoteInput.value = '';
    }

    // Event listener for adding a note
    addNoteButton.addEventListener('click', addNote);

    // Event listener for adding a note by pressing Enter key
    newNoteInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNote();
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" },
        { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", category: "Wisdom" }
    ];

    // Function to display a random quote
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
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
                alert('Quote added successfully!');
                addQuoteForm.reset();
            } else {
                alert('Please enter both the quote text and the category.');
            }
        });
    }

    // Initial setup
    createAddQuoteForm();
    showRandomQuote();

    // Event listener for showing a random quote
    const randomQuoteButton = document.getElementById('show-random-quote');
    randomQuoteButton.addEventListener('click', showRandomQuote);
});
document.addEventListener('DOMContentLoaded', function() {
    const quotesKey = 'quotes';
    const quotes = loadQuotesFromLocalStorage() || [
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

    // Function to display a random quote
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
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
                    quotes.push(...importedQuotes);
                    saveQuotesToLocalStorage();
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

    // Initial setup
    createAddQuoteForm();
    showRandomQuote();

    // Event listener for showing a random quote
    const randomQuoteButton = document.getElementById('show-random-quote');
    randomQuoteButton.addEventListener('click', showRandomQuote);

    // Event listeners for import/export
    const exportButton = document.getElementById('export-quotes');
    exportButton.addEventListener('click', exportQuotesToJSON);

    const importInput = document.getElementById('import-quotes');
    importInput.addEventListener('change', importQuotesFromJSON);
});
document.addEventListener('DOMContentLoaded', function() {
    const quotesKey = 'quotes';
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

    // Function to display a random quote
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
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

    // Initial setup
    createAddQuoteForm();
    showRandomQuote();

    // Event listener for showing a random quote
    const randomQuoteButton = document.getElementById('show-random-quote');
    randomQuoteButton.addEventListener('click', showRandomQuote);

    // Event listeners for import/export
    const exportButton = document.getElementById('export-quotes');
    exportButton.addEventListener('click', exportQuotesToJSON);

    const importInput = document.getElementById('import-quotes');
    importInput.addEventListener('change', importQuotesFromJSON);
});
