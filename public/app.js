// Application State
let state = {
    image: null,
    rows: [],
    tasks: [],
    addRowMode: false
};

// Canvas elements
let canvas, ctx;
let imageObj = new Image();

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('vineyard-canvas');
    ctx = canvas.getContext('2d');
    
    // Load saved state from localStorage
    loadState();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial state
    if (state.image) {
        loadImageFromState();
    }
});

function setupEventListeners() {
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);
    document.getElementById('clear-image').addEventListener('click', clearImage);
    document.getElementById('add-row-mode').addEventListener('click', toggleRowMode);
    document.getElementById('clear-rows').addEventListener('click', clearRows);
    document.getElementById('create-task').addEventListener('click', createTask);
    document.getElementById('ai-detect-rows').addEventListener('click', aiDetectRows);
    canvas.addEventListener('click', handleCanvasClick);
}

// Image handling
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        state.image = event.target.result;
        loadImageFromState();
        saveState();
    };
    reader.readAsDataURL(file);
}

function loadImageFromState() {
    imageObj.onload = () => {
        // Set canvas size to image size (max 1000px width)
        const maxWidth = 1000;
        const scale = Math.min(1, maxWidth / imageObj.width);
        canvas.width = imageObj.width * scale;
        canvas.height = imageObj.height * scale;
        
        drawCanvas();
        
        // Show relevant sections
        document.getElementById('canvas-container').style.display = 'block';
        document.getElementById('clear-image').style.display = 'inline-block';
        document.getElementById('rows-section').style.display = 'block';
        document.getElementById('tasks-section').style.display = 'block';
    };
    imageObj.src = state.image;
}

function drawCanvas() {
    if (!imageObj.complete) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    
    // Draw rows
    state.rows.forEach((row, index) => {
        drawRow(row, index);
    });
}

function drawRow(row, index) {
    const scale = canvas.width / imageObj.width;
    const x = row.x * scale;
    const y = row.y * scale;
    
    // Draw marker circle
    ctx.fillStyle = 'rgba(102, 126, 234, 0.7)';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw row number
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(index + 1, x, y);
}

function clearImage() {
    if (!confirm('This will clear the image and all data. Continue?')) return;
    
    state = {
        image: null,
        rows: [],
        tasks: [],
        addRowMode: false
    };
    
    document.getElementById('canvas-container').style.display = 'none';
    document.getElementById('clear-image').style.display = 'none';
    document.getElementById('rows-section').style.display = 'none';
    document.getElementById('tasks-section').style.display = 'none';
    document.getElementById('image-upload').value = '';
    
    saveState();
    renderTasks();
}

// Row handling
function toggleRowMode() {
    state.addRowMode = !state.addRowMode;
    const btn = document.getElementById('add-row-mode');
    
    if (state.addRowMode) {
        btn.textContent = '✓ Click on image to add rows';
        btn.style.background = '#48bb78';
        canvas.style.cursor = 'crosshair';
    } else {
        btn.textContent = '➕ Add Row Markers';
        btn.style.background = '#667eea';
        canvas.style.cursor = 'default';
    }
}

function handleCanvasClick(e) {
    if (!state.addRowMode) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Check if clicking on existing row (to delete)
    const scale = canvas.width / imageObj.width;
    const clickedRowIndex = state.rows.findIndex(row => {
        const rowX = row.x * scale;
        const rowY = row.y * scale;
        const distance = Math.sqrt(Math.pow(x - rowX, 2) + Math.pow(y - rowY, 2));
        return distance < 15;
    });
    
    if (clickedRowIndex !== -1) {
        // Remove row
        state.rows.splice(clickedRowIndex, 1);
        // Update tasks to remove this row
        state.tasks.forEach(task => {
            task.rows = task.rows.filter(r => r < clickedRowIndex).concat(
                task.rows.filter(r => r > clickedRowIndex).map(r => r - 1)
            );
            task.completed = task.completed.filter(r => r < clickedRowIndex).concat(
                task.completed.filter(r => r > clickedRowIndex).map(r => r - 1)
            );
        });
    } else {
        // Add new row
        const originalScale = imageObj.width / canvas.width;
        state.rows.push({
            x: x * originalScale,
            y: y * originalScale
        });
    }
    
    drawCanvas();
    updateRowCount();
    renderTasks();
    saveState();
}

function clearRows() {
    if (!confirm('Clear all row markers?')) return;
    
    state.rows = [];
    state.tasks = [];
    drawCanvas();
    updateRowCount();
    renderTasks();
    saveState();
}

function updateRowCount() {
    document.getElementById('row-count').textContent = state.rows.length;
}

// AI-powered row detection
async function aiDetectRows() {
    const statusDiv = document.getElementById('ai-status');
    
    if (!state.image) {
        alert('Please upload an image first');
        return;
    }
    
    // Show loading status
    statusDiv.style.display = 'block';
    statusDiv.className = 'ai-status loading';
    statusDiv.textContent = '🔄 Analyzing image with AI... This may take 10-30 seconds.';
    
    try {
        // Call backend API instead of OpenAI directly
        const response = await fetch('/api/detect-rows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: state.image
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API error: ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // Extract JSON from response (handle markdown code blocks)
        let jsonContent = content;
        if (content.includes('```')) {
            // Try to extract content between code fences
            const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (match) {
                jsonContent = match[1].trim();
            }
        }
        
        // Parse the coordinates
        const detectedRows = JSON.parse(jsonContent);
        
        if (!Array.isArray(detectedRows) || detectedRows.length === 0) {
            throw new Error('No rows detected in the image');
        }
        
        // Convert percentage coordinates to actual pixel coordinates
        state.rows = detectedRows.map(row => ({
            x: (row.x / 100) * imageObj.width,
            y: (row.y / 100) * imageObj.height
        }));
        
        // Update UI
        drawCanvas();
        updateRowCount();
        renderTasks();
        saveState();
        
        statusDiv.className = 'ai-status success';
        statusDiv.textContent = `✅ Success! Detected ${state.rows.length} vineyard rows.`;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        console.error('AI detection error:', error);
        statusDiv.className = 'ai-status error';
        statusDiv.textContent = `❌ Error: ${error.message}`;
    }
}

// Task handling
function createTask() {
    const nameInput = document.getElementById('task-name');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter a task name');
        return;
    }
    
    if (state.rows.length === 0) {
        alert('Please add some row markers first');
        return;
    }
    
    const task = {
        id: Date.now(),
        name: name,
        rows: state.rows.map((_, i) => i), // All rows
        completed: [],
        createdAt: new Date().toISOString()
    };
    
    state.tasks.push(task);
    nameInput.value = '';
    
    renderTasks();
    saveState();
}

function toggleRowCompletion(taskId, rowIndex) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const completedIndex = task.completed.indexOf(rowIndex);
    if (completedIndex === -1) {
        task.completed.push(rowIndex);
    } else {
        task.completed.splice(completedIndex, 1);
    }
    
    renderTasks();
    saveState();
}

function deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    renderTasks();
    saveState();
}

function renderTasks() {
    const container = document.getElementById('tasks-list');
    
    if (state.tasks.length === 0) {
        container.innerHTML = '<p class="info">No tasks yet. Create a task to start tracking progress.</p>';
        return;
    }
    
    container.innerHTML = state.tasks.map(task => {
        const progress = (task.completed.length / task.rows.length) * 100;
        
        return `
            <div class="task">
                <div class="task-header">
                    <h3 class="task-title">${escapeHtml(task.name)}</h3>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                        🗑️ Delete
                    </button>
                </div>
                
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                    <div class="progress-text">${progress.toFixed(1)}% Complete (${task.completed.length}/${task.rows.length} rows)</div>
                </div>
                
                <div class="rows-grid">
                    ${task.rows.map(rowIndex => `
                        <div class="row-item ${task.completed.includes(rowIndex) ? 'completed' : ''}"
                             onclick="toggleRowCompletion(${task.id}, ${rowIndex})">
                            ${task.completed.includes(rowIndex) ? '' : rowIndex + 1}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Utility functions
function saveState() {
    const stateToSave = {
        image: state.image,
        rows: state.rows,
        tasks: state.tasks
    };
    localStorage.setItem('vineyardState', JSON.stringify(stateToSave));
}

function loadState() {
    const saved = localStorage.getItem('vineyardState');
    if (saved) {
        const loaded = JSON.parse(saved);
        state.image = loaded.image;
        state.rows = loaded.rows || [];
        state.tasks = loaded.tasks || [];
        
        updateRowCount();
        renderTasks();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
