        const STORAGE_KEY = 'taskapp_tasks';
        const TRACKED_KEY = 'taskapp_total_tracked';
        const taskForm = document.getElementById('taskForm');
        const taskList = document.getElementById('taskList');
        const totalCount = document.getElementById('totalCount');
        const pendingCount = document.getElementById('pendingCount');
        const completedCount = document.getElementById('completedCount');
        const activeProjectsCount = document.getElementById('activeProjectsCount');
        const trackedCount = document.getElementById('trackedCount');
        const emptyState = document.getElementById('emptyState');

        function formatDate(value) {
            if (!value) return 'No deadline';
            return new Date(value).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        function getPriorityClass(priority) {
            return priority.toLowerCase();
        }

        function saveTasks() {
            const tasks = Array.from(taskList.querySelectorAll('.task-item')).map(item => ({
                id: item.dataset.id,
                title: item.querySelector('.task-title').textContent.trim(),
                dueDate: item.dataset.dueDate || '',
                priority: item.dataset.priority || 'Normal',
                completed: item.classList.contains('completed')
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }

        function getTotalTracked() {
            return Number(localStorage.getItem(TRACKED_KEY) || 0);
        }

        function setTotalTracked(value) {
            localStorage.setItem(TRACKED_KEY, String(value));
        }

        function buildTaskItem(task) {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            taskItem.dataset.dueDate = task.dueDate;
            taskItem.dataset.priority = task.priority;
            if (task.completed) taskItem.classList.add('completed');
            taskItem.innerHTML = `
                <div class="task-details">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span>${task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No deadline'}</span>
                        <span class="prio prio-${getPriorityClass(task.priority)}">${task.priority}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button type="button" class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button type="button" class="remove-btn">Remove</button>
                </div>
            `;

            const completeBtn = taskItem.querySelector('.complete-btn');
            const removeBtn = taskItem.querySelector('.remove-btn');

            completeBtn.addEventListener('click', () => {
                taskItem.classList.toggle('completed');
                completeBtn.textContent = taskItem.classList.contains('completed') ? 'Undo' : 'Complete';
                updateCounts();
                saveTasks();
            });

            removeBtn.addEventListener('click', () => {
                taskItem.remove();
                updateCounts();
                saveTasks();
            });

            return taskItem;
        }

        function updateCounts() {
            const items = taskList.querySelectorAll('.task-item');
            const total = items.length;
            const completed = taskList.querySelectorAll('.task-item.completed').length;
            const pending = total - completed;
            totalCount.textContent = total;
            pendingCount.textContent = pending;
            completedCount.textContent = completed;
            activeProjectsCount.textContent = pending;
            trackedCount.textContent = getTotalTracked();
            emptyState.hidden = total > 0;
        }

        function loadTasks() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (!stored) return;
                const tasks = JSON.parse(stored);
                if (!Array.isArray(tasks)) return;
                tasks.forEach(task => taskList.appendChild(buildTaskItem(task)));
            } catch (error) {
                console.warn('Unable to load saved tasks:', error);
            }
        }

        function createTaskData(title, dueDate, priority) {
            const tracked = getTotalTracked() + 1;
            setTotalTracked(tracked);
            return {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                title,
                dueDate,
                priority,
                completed: false
            };
        }

        taskForm.addEventListener('submit', event => {
            event.preventDefault();
            const title = event.target.title.value.trim();
            const dueDate = event.target.dueDate.value;
            const priority = event.target.priority.value;
            if (!title) return;

            const task = createTaskData(title, dueDate, priority);
            taskList.appendChild(buildTaskItem(task));
            taskForm.reset();
            event.target.title.focus();
            updateCounts();
            saveTasks();
        });

        loadTasks();
        if (!localStorage.getItem(TRACKED_KEY)) {
            setTotalTracked(0);
        }
        updateCounts();
