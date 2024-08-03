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
