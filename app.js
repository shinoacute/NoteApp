// Save notes in array
let notes = [];
let editingNoteId = null // Track the note being edited

// Load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}

// Save Note (add or update)
function saveNote(event) {
    event.preventDefault()

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (editingNoteId) {
        // Update existing note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId)
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }
    } else {
        // Add New Note
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        })
    }

    closeNoteDialog()
    saveNotes()
    renderNotes()
}

// Create unique ID for each note
function generateId() {
    return Date.now().toString()
}

// Save notes to localStorage as string
function saveNotes() {
    localStorage.setItem('quickNotes', JSON.stringify(notes));
}

// Delete a note by id
function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId)
    saveNotes()
    renderNotes()
}

// Render Notes to the DOM
function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');

    if (notes.length === 0) {
        // Show empty state if no notes
        notesContainer.innerHTML = `
            <div class="empty-state">
                <h2>No Notes Yet</h2>
                <p>Create your first note to get started!</p>
                <button class='add-note-btn' onclick="openNoteDialog()">Add Your First Note</button>
            </div>
        `
        return
    }

    // Display all notes
    notesContainer.innerHTML = notes.map(note => `
        <div class="note-card">
            <h3 class='note-title'>${note.title}</h3>
            <p class='note-content'>${note.content}</p>

            <div class="note-actions">
                <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Edit Note">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                    </svg>
                </button>
            </div>
            
        </div>
    `).join('')
}

// Open Dialog for adding/editing note
function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if(noteId) {
        // Edit Mode
        const noteToEdit = notes.find(note => note.id === noteId)
        editingNoteId = noteId
        document.getElementById('dialogTitle').textContent = "Edit Note"
        titleInput.value = noteToEdit.title
        contentInput.value = noteToEdit.content
    } 
    else {
        // Add Mode
        editingNoteId = null
        document.getElementById('dialogTitle').textContent = "Add New Note"
        titleInput.value = ''
        contentInput.value = ''
    }

    dialog.showModal();
    titleInput.focus();
}

// Close Dialog
function closeNoteDialog() {
    document.getElementById('noteDialog').close();
}

// Toggle between dark and light theme
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}

// Apply saved theme on page load
function applySavedTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme')
        document.getElementById('themeToggleBtn').textContent = '☀️'
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    applySavedTheme()
    notes = loadNotes()
    renderNotes()

    // Handle note form submit
    document.getElementById('noteForm').addEventListener('submit', saveNote)
    // Handle theme toggle button
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    // Close dialog when clicking outside
    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if (event.target === this) {
            closeNoteDialog()
        }
    })
})
