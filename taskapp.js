        const taskForm = document.getElementById('taskForm');
        const taskList = document.getElementById('taskList');
        const totalCount = document.getElementById('totalCount');
        const pendingCount = document.getElementById('pendingCount');
        const completedCount = document.getElementById('completedCount');

        function updateCounts() {
            const items = taskList.querySelectorAll('.task-item');
            const total = items.length;
            const completed = taskList.querySelectorAll('.task-item.completed').length;
            const pending = total - completed;
            totalCount.textContent = total || 0;
            pendingCount.textContent = pending || 0;
            completedCount.textContent = completed || 0;
        }

        taskForm.addEventListener('submit', event => {
            event.preventDefault();
            const title = event.target.title.value.trim();
            const dueDate = event.target.dueDate.value;
            const priority = event.target.priority.value;
            if (!title) return;

            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <div class="task-details">
                    <div class="task-title">${title}</div>
                    <div class="task-meta">
                        <span>${dueDate ? `Due ${new Date(dueDate).toLocaleDateString()}` : 'No deadline'}</span>
                        <span class="prio">${priority.toUpperCase()}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button type="button" class="complete-btn">Complete</button>
                    <button type="button" class="remove-btn">Remove</button>
                </div>
            `;

            const completeBtn = taskItem.querySelector('.complete-btn');
            const removeBtn = taskItem.querySelector('.remove-btn');

            completeBtn.addEventListener('click', () => {
                taskItem.classList.toggle('completed');
                completeBtn.textContent = taskItem.classList.contains('completed') ? 'Undo' : 'Complete';
                updateCounts();
            });

            removeBtn.addEventListener('click', () => {
                taskItem.remove();
                updateCounts();
            });

            taskList.appendChild(taskItem);
            taskForm.reset();
            event.target.title.focus();
            updateCounts();
        });

        // initialize counts
        updateCounts();
