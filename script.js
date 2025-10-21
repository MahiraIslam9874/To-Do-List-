document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const form = document.getElementById('toDoForm');
    const tableBody = document.getElementById('toDoTable').getElementsByTagName('tbody')[0];
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    let isEditing = false;
    let currentRow = null;
    
    // Labels for mobile table responsiveness (data-label attribute)
    const columnLabels = {
        name: 'Your Name',
        polytechnic: 'Your Polytechnic',
        classNo: 'Class No.',
        classDate: 'Class Date',
        toolsUsed: 'Class Tools Used',
        workDetails: 'Class Work Details',
        remarks: 'Remarks'
    };
    
    /* =================================== */
    /* 1. Theme Switching Logic */
    /* =================================== */
    
    // Function to load the theme preference from localStorage
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Event listener for theme button click
    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        
        // Toggle icon based on the current theme
        if (currentTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
    
    loadTheme(); // Load theme when the page is loaded

    /* =================================== */
    /* 2. To-Do List CRUD Logic */
    /* =================================== */

    // Load existing data from localStorage
    let entries = JSON.parse(localStorage.getItem('toDoEntries')) || [];
    entries.forEach((entry, index) => createTableRow(entry, index));

    // Handle form submission (Create or Update)
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const data = {
            name: document.getElementById('name').value,
            polytechnic: document.getElementById('polytechnic').value,
            classNo: document.getElementById('classNo').value,
            classDate: document.getElementById('classDate').value,
            toolsUsed: document.getElementById('toolsUsed').value,
            workDetails: document.getElementById('workDetails').value,
            remarks: document.getElementById('remarks').value,
        };

        if (isEditing) {
            // Update existing entry
            updateEntryInArray(currentRow.dataIndex, data);
            updateTableRow(currentRow, data);
            isEditing = false;
            currentRow = null;
            document.getElementById('submitBtn').textContent = 'Submit Entry'; // Reset button text
        } else {
            // Create new entry
            entries.push(data);
            createTableRow(data, entries.length - 1);
        }

        saveEntries(); // Save the updated array to localStorage
        form.reset(); // Clear the form
    });

    // Creates a new row in the HTML table
    function createTableRow(data, index) {
        const row = tableBody.insertRow();
        row.dataIndex = index; // Store index for editing/deleting
        
        const keys = ['name', 'polytechnic', 'classNo', 'classDate', 'toolsUsed', 'workDetails', 'remarks'];

        keys.forEach(key => {
            let cell = row.insertCell();
            cell.textContent = data[key];
            cell.setAttribute('data-label', columnLabels[key]); // For mobile responsiveness
        });

        // Action buttons (Edit/Delete)
        const actionCell = row.insertCell();
        actionCell.setAttribute('data-label', 'Actions');
        actionCell.appendChild(createButton('Edit', 'edit-btn', function() {
            editRow(row, data);
        }));
        actionCell.appendChild(createButton('Delete', 'delete-btn', function() {
            deleteRow(row);
        }));
    }

    // Updates the content of an existing row in the table
    function updateTableRow(row, data) {
        const cells = row.cells;
        const keys = ['name', 'polytechnic', 'classNo', 'classDate', 'toolsUsed', 'workDetails', 'remarks'];

        keys.forEach((key, i) => {
            cells[i].textContent = data[key];
        });
    }

    // Utility function to create action buttons
    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('action-btn', className);
        button.addEventListener('click', onClick);
        return button;
    }

    // Load data into the form for editing
    function editRow(row, data) {
        isEditing = true;
        currentRow = row;
        document.getElementById('submitBtn').textContent = 'Update Entry'; // Change button text

        // Populate form fields
        document.getElementById('name').value = data.name;
        document.getElementById('polytechnic').value = data.polytechnic;
        document.getElementById('classNo').value = data.classNo;
        document.getElementById('classDate').value = data.classDate;
        document.getElementById('toolsUsed').value = data.toolsUsed;
        document.getElementById('workDetails').value = data.workDetails;
        document.getElementById('remarks').value = data.remarks;
    }

    // Delete row logic
    function deleteRow(row) {
        if (confirm('Are you sure you want to delete this entry?')) {
            // Remove from the entries array
            entries.splice(row.dataIndex, 1);
            saveEntries();

            // Re-render table to update dataIndex properties correctly
            tableBody.innerHTML = '';
            entries.forEach((entry, index) => createTableRow(entry, index));
        }
    }

    // Update the entry in the main data array
    function updateEntryInArray(index, data) {
        entries[index] = data;
    }

    // Save the entries array to localStorage
    function saveEntries() {
        localStorage.setItem('toDoEntries', JSON.stringify(entries));
    }
});