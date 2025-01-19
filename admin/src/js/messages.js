document.addEventListener('DOMContentLoaded', function() {
    // Set active state for current page in mobile nav
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize more menu modal
    const moreButton = document.getElementById('mobileMenuMore');
    const menuModal = new bootstrap.Modal(document.getElementById('mobileMenuModal'));

    moreButton.addEventListener('click', function(e) {
        e.preventDefault();
        menuModal.show();
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Redirect to login page if the user is not logged in
    if (!sessionStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // Define idle timeout duration in milliseconds (e.g., 10 minutes)
    const IDLE_TIMEOUT = 10 * 60 * 1000;

    let idleTimer;

    // Function to reset the idle timer
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            logout(); // Log out user if idle time exceeds the limit
        }, IDLE_TIMEOUT);
    }

    // Listen for user interactions to reset the idle timer
    ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
        document.addEventListener(event, resetIdleTimer);
    });

    // Initialize the idle timer when the page loads
    resetIdleTimer();
});

function logout() {
    sessionStorage.clear();
    alert('You have been logged out due to inactivity.');
    window.location.href = 'index.html';
}
let currentFilter = 'all';
let lastMessageCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadMessages();

    // Request notification permission
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Check for new messages every 30 seconds
    setInterval(checkNewMessages, 30000);
});

async function loadMessages() {
    try {
        const response = await fetch('get_messages.php');
        const data = await response.json();

        console.log('Response:', data); // Debug log

        if (!data.success) {
            throw new Error(data.error || 'Unknown error occurred');
        }

        document.getElementById('newMessages').textContent = data.new_count;

        const tableBody = document.getElementById('messagesTable');
        if (!data.messages || !Array.isArray(data.messages)) {
            throw new Error('Invalid messages data received');
        }

        tableBody.innerHTML = data.messages
            .filter(msg => currentFilter === 'all' || msg.status === currentFilter)
            .map(msg => `
                <tr>
                    <td><span class="message-status status-${msg.status}"></span>${msg.status}</td>
                    <td>${msg.first_name || ''} ${msg.last_name || ''}</td>
                    <td>${msg.email || ''}</td>
                    <td>${msg.subject || ''}</td>
                    <td>${new Date(msg.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewMessage(${msg.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="editMessage(${msg.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="changeStatus(${msg.id}, '${msg.status}')">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmDelete(${msg.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="6" class="text-center">No messages found</td></tr>';
    } catch (error) {
        console.error('Error details:', error);
        document.getElementById('messagesTable').innerHTML =
            `<tr><td colspan="6" class="text-center text-danger">Error: ${error.message}</td></tr>`;
    }
}

function filterMessages(status) {
    currentFilter = status;
    loadMessages();
}

async function viewMessage(id) {
    try {
        const response = await fetch(`get_message_details.php?id=${id}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to load message');
        }

        const message = result.data; // Access the message from the data property

        document.getElementById('messageDetails').innerHTML = `
            <p><strong>From:</strong> ${message.first_name || ''} ${message.last_name || ''}</p>
            <p><strong>Email:</strong> ${message.email || ''}</p>
            <p><strong>Subject:</strong> ${message.subject || ''}</p>
            <p><strong>Message:</strong></p>
            <p>${message.message || ''}</p>
        `;

        new bootstrap.Modal(document.getElementById('messageModal')).show();

        // Mark as read if it's new
        if (message.status === 'new') {
            await fetch('update_message_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    status: 'read'
                })
            });
            loadMessages();
        }
    } catch (error) {
        console.error('Error viewing message:', error);
        alert('Failed to load message details: ' + error.message);
    }
}

async function editMessage(id) {
    try {
        const response = await fetch(`get_message_details.php?id=${id}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to load message');
        }

        const message = result.data;

        // Populate edit form
        document.getElementById('editMessageId').value = message.id;
        document.getElementById('editFirstName').value = message.first_name || '';
        document.getElementById('editLastName').value = message.last_name || '';
        document.getElementById('editEmail').value = message.email || '';
        document.getElementById('editSubject').value = message.subject || '';
        document.getElementById('editMessage').value = message.message || '';

        new bootstrap.Modal(document.getElementById('editModal')).show();
    } catch (error) {
        console.error('Error loading message for edit:', error);
        alert('Failed to load message for editing');
    }
}

async function saveEdit() {
    try {
        const id = document.getElementById('editMessageId').value;
        const firstName = document.getElementById('editFirstName').value.trim();
        const email = document.getElementById('editEmail').value.trim();

        // Basic validation
        if (!firstName || !email) {
            throw new Error('First name and email are required');
        }

        const data = {
            id: id,
            first_name: firstName,
            last_name: document.getElementById('editLastName').value.trim(),
            email: email,
            subject: document.getElementById('editSubject').value.trim(),
            message: document.getElementById('editMessage').value.trim()
        };

        const response = await fetch('update_message.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned invalid response format');
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Failed to update message');
        }

        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        loadMessages();
        alert('Message updated successfully!');
    } catch (error) {
        console.error('Error saving edit:', error);
        alert('Failed to save changes: ' + error.message);
    }
}

async function changeStatus(id, currentStatus) {
    document.getElementById('statusMessageId').value = id;
    document.getElementById('messageStatus').value = currentStatus;
    new bootstrap.Modal(document.getElementById('statusModal')).show();
}

async function saveStatus() {
    try {
        const id = document.getElementById('statusMessageId').value;
        const status = document.getElementById('messageStatus').value;

        const response = await fetch('update_message_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id,
                status
            })
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Failed to update status');
        }

        bootstrap.Modal.getInstance(document.getElementById('statusModal')).hide();
        loadMessages();
        alert('Status updated successfully!');
    } catch (error) {
        console.error('Error saving status:', error);
        alert('Failed to save status: ' + error.message);
    }
}

function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
        deleteMessage(id);
    }
}

async function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            await fetch('delete_message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            });
            loadMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    }
}

async function checkNewMessages() {
    try {
        const response = await fetch('check_new_messages.php');
        const data = await response.json();

        if (data.success && data.new_count > lastMessageCount) {
            // Play notification sound
            document.getElementById('notificationSound').play();

            // Show notification
            if (Notification.permission === "granted") {
                new Notification("New Message", {
                    body: "You have a new contact message!",
                    icon: "assets/favicon.ico"
                });
            }

            // Update the messages list
            loadMessages();
        }

        lastMessageCount = data.new_count;
    } catch (error) {
        console.error('Error checking new messages:', error);
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}