document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const addUserBtn = document.getElementById('addUserBtn');
    const streakBody = document.getElementById('streakBody');
    const statusMessage = document.getElementById('status-message');
    
    // Modal elements
    const modal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const submitPasswordBtn = document.getElementById('submitPasswordBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalError = document.getElementById('modalError');
    
    let currentCallback = null;
    let hasAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    
    // Helper to display status messages
    function showMessage(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.className = isError ? 'status-message error' : 'status-message success';
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
            // loadStreaks();
        }, 3000);
    }

    // Modal password verification
    function verifyPassword(callback) {
        // If already authenticated in this session, skip the password check
        if (hasAuthenticated) {
            callback();
            return;
        }
        
        // Otherwise, continue with the password modal
        currentCallback = callback;
        passwordInput.value = '';
        modalError.style.display = 'none';
        modal.style.display = 'block';
        passwordInput.focus();
    }
    
    // Check the password and execute callback if correct
    function checkPassword() {
        const password = passwordInput.value;
        const actualPassword = (+!+[] + +!+[] + +!+[] + +!+[]) * 1000 + (+!+[] + +!+[] + +!+[]) * 100 + (+!+[] + +!+[]) * 10 + (+!+[] + +!+[] + +!+[] + +!+[]) - (3*1030);

        if (password == actualPassword) {
            // Password is correct, execute the callback
            // Set the authenticated flag in sessionStorage
            sessionStorage.setItem('authenticated', 'true');
            hasAuthenticated = true;
            
            // Hide the modal
            modal.style.display = 'none';
            
            // Execute the callback if it exists
            if (currentCallback) {
                currentCallback();
                currentCallback = null;
            }
        } else {
            // Show error message
            modalError.textContent = 'Incorrect password. Please try again.';
            modalError.style.display = 'block';
            
            // Clear the input
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    // Close the modal without executing callback
    function closeModal() {
        modal.style.display = 'none';
        currentCallback = null;
        showMessage('Action cancelled.', true);
    }
    
    // Modal event listeners
    submitPasswordBtn.addEventListener('click', checkPassword);
    
    cancelPasswordBtn.addEventListener('click', closeModal);
    
    closeModalBtn.addEventListener('click', closeModal);
    
    // Allow pressing Enter to submit
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Close modal if clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Load and display streaks
    function loadStreaks() {
        fetch('/api/streaks')
            .then(response => response.json())
            .then(data => {
                streakBody.innerHTML = '';
                
                // Convert object to array and sort by streak in descending order
                const sortedEntries = Object.entries(data)
                    .sort((a, b) => b[1] - a[1]);
                
                for (const [user, streak] of sortedEntries) {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${user}</td>
                        <td>${streak}</td>
                        <td>
                            <button class="increment-btn" data-user="${user}">+</button>
                            <button class="delete-btn" data-user="${user}">×</button>
                        </td>
                    `;
                    
                    streakBody.appendChild(row);
                }
            })
            .catch(error => {
                console.error('Error loading streaks:', error);
                showMessage('Failed to load streaks.', true);
            });
    }
    
    // Add a new user
    function addUser(user) {
        if (!user) {
            showMessage('Please enter a username.', true);
            return;
        }
        
        fetch('/api/streaks/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(data => {
            showMessage(`User "${user}" added with streak of 0.`);
            userInput.value = '';
            loadStreaks();
        })
        .catch(error => {
            showMessage(error || 'Failed to add user.', true);
        });
    }
    
    // Increment streak for a user
    function incrementStreak(user) {
        if (!user) {
            showMessage('Please enter a username.', true);
            return;
        }
        
        fetch('/api/streaks/plus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(data => {
            showMessage(`Streak for "${user}" incremented to ${data.streak}.`);
            loadStreaks();
        })
        .catch(error => {
            showMessage(error || 'Failed to increment streak.', true);
        });
    }
    
    // Delete a user
    function deleteUser(user) {
        if (!user) {
            showMessage('Please enter a username.', true);
            return;
        }
        
        fetch('/api/streaks/end', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(data => {
            showMessage(`User "${user}" deleted.`);
            userInput.value = '';
            loadStreaks();
        })
        .catch(error => {
            showMessage(error || 'Failed to delete user.', true);
        });
    }
    
    // Event listeners
    addUserBtn.addEventListener('click', () => {
        addUser(userInput.value.trim());
    });
    
    // Add keyboard event listener for Enter key in the input field
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addUser(userInput.value.trim());
        }
    });

    // Table event listeners for increment and delete buttons
    streakBody.addEventListener('click', function(e) {
        const user = e.target.getAttribute('data-user');
        
        if (e.target.classList.contains('increment-btn')) {
            verifyPassword(() => incrementStreak(user));
        }
        
        if (e.target.classList.contains('delete-btn')) {
            verifyPassword(() => deleteUser(user));
        }
    });

    // Initial load of streaks
    loadStreaks();
});