// Work Assistant for Career Mentor
class WorkAssistant {
  constructor() {
    this.tasks = [];
    this.reminders = [];
    this.notes = [];
    this.isInitialized = false;
  }
  
  // Initialize the work assistant
  init() {
    this.createUI();
    this.bindEvents();
    this.loadData();
    this.isInitialized = true;
    this.renderData();
  }
  
  // Create work assistant UI
  createUI() {
    // Only create if on tasks section
    if (!document.getElementById('tasks-section')) return;
    
    const container = document.getElementById('tasks-section');
    container.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center">
          <span class="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full mr-2">
            <i class="fas fa-tasks text-indigo-600"></i>
          </span>
          Work Assistant
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Tasks Column -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Tasks</h3>
              <button id="add-task-button" class="text-indigo-600 hover:text-indigo-800 focus:outline-none">
                <i class="fas fa-plus-circle text-lg"></i>
              </button>
            </div>
            
            <div id="add-task-form" class="mb-4 hidden">
              <div class="mb-2">
                <input type="text" id="task-title" placeholder="Task title" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
              </div>
              <div class="mb-2">
                <textarea id="task-description" placeholder="Description (optional)" rows="2" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"></textarea>
              </div>
              <div class="mb-2">
                <input type="date" id="task-due-date" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
              </div>
              <div class="flex space-x-2">
                <button id="save-task-button" class="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors">Save</button>
                <button id="cancel-task-button" class="bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-400 transition-colors">Cancel</button>
              </div>
            </div>
            
            <div id="tasks-list" class="space-y-2 max-h-96 overflow-y-auto">
              <!-- Tasks will be populated here -->
              <div class="text-gray-500 text-center py-4">No tasks yet</div>
            </div>
          </div>
          
          <!-- Reminders Column -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Reminders</h3>
              <button id="add-reminder-button" class="text-indigo-600 hover:text-indigo-800 focus:outline-none">
                <i class="fas fa-plus-circle text-lg"></i>
              </button>
            </div>
            
            <div id="add-reminder-form" class="mb-4 hidden">
              <div class="mb-2">
                <input type="text" id="reminder-text" placeholder="Reminder text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
              </div>
              <div class="mb-2">
                <input type="datetime-local" id="reminder-time" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
              </div>
              <div class="flex space-x-2">
                <button id="save-reminder-button" class="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors">Save</button>
                <button id="cancel-reminder-button" class="bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-400 transition-colors">Cancel</button>
              </div>
            </div>
            
            <div id="reminders-list" class="space-y-2 max-h-96 overflow-y-auto">
              <!-- Reminders will be populated here -->
              <div class="text-gray-500 text-center py-4">No reminders yet</div>
            </div>
          </div>
          
          <!-- Notes Column -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Notes</h3>
              <button id="add-note-button" class="text-indigo-600 hover:text-indigo-800 focus:outline-none">
                <i class="fas fa-plus-circle text-lg"></i>
              </button>
            </div>
            
            <div id="add-note-form" class="mb-4 hidden">
              <div class="mb-2">
                <input type="text" id="note-title" placeholder="Note title" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
              </div>
              <div class="mb-2">
                <textarea id="note-content" placeholder="Note content" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"></textarea>
              </div>
              <div class="flex space-x-2">
                <button id="save-note-button" class="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors">Save</button>
                <button id="cancel-note-button" class="bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-400 transition-colors">Cancel</button>
              </div>
            </div>
            
            <div id="notes-list" class="space-y-2 max-h-96 overflow-y-auto">
              <!-- Notes will be populated here -->
              <div class="text-gray-500 text-center py-4">No notes yet</div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h3 class="text-lg font-medium mb-2 flex items-center">
            <i class="fas fa-lightbulb text-indigo-600 mr-2"></i>
            AMI Suggestions
          </h3>
          <div id="ami-suggestions" class="text-gray-700">
            <!-- AMI suggestions will be populated here -->
            <p>I'll analyze your tasks and provide personalized productivity tips here.</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // Bind events to UI elements
  bindEvents() {
    if (!document.getElementById('tasks-section')) return;
    
    // Task buttons
    const addTaskButton = document.getElementById('add-task-button');
    const saveTaskButton = document.getElementById('save-task-button');
    const cancelTaskButton = document.getElementById('cancel-task-button');
    
    addTaskButton.addEventListener('click', () => this.showForm('task'));
    saveTaskButton.addEventListener('click', () => this.saveTask());
    cancelTaskButton.addEventListener('click', () => this.hideForm('task'));
    
    // Reminder buttons
    const addReminderButton = document.getElementById('add-reminder-button');
    const saveReminderButton = document.getElementById('save-reminder-button');
    const cancelReminderButton = document.getElementById('cancel-reminder-button');
    
    addReminderButton.addEventListener('click', () => this.showForm('reminder'));
    saveReminderButton.addEventListener('click', () => this.saveReminder());
    cancelReminderButton.addEventListener('click', () => this.hideForm('reminder'));
    
    // Note buttons
    const addNoteButton = document.getElementById('add-note-button');
    const saveNoteButton = document.getElementById('save-note-button');
    const cancelNoteButton = document.getElementById('cancel-note-button');
    
    addNoteButton.addEventListener('click', () => this.showForm('note'));
    saveNoteButton.addEventListener('click', () => this.saveNote());
    cancelNoteButton.addEventListener('click', () => this.hideForm('note'));
  }
  
  // Show add form
  showForm(type) {
    document.getElementById(`add-${type}-form`).classList.remove('hidden');
    document.getElementById(`add-${type}-button`).classList.add('hidden');
    
    // Set default date for tasks
    if (type === 'task') {
      const today = new Date();
      const formattedDate = today.toISOString().substr(0, 10);
      document.getElementById('task-due-date').value = formattedDate;
    }
    
    // Set default time for reminders
    if (type === 'reminder') {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30); // Default to 30 minutes from now
      const formattedDateTime = now.toISOString().substr(0, 16);
      document.getElementById('reminder-time').value = formattedDateTime;
    }
  }
  
  // Hide add form
  hideForm(type) {
    document.getElementById(`add-${type}-form`).classList.add('hidden');
    document.getElementById(`add-${type}-button`).classList.remove('hidden');
    
    // Clear form fields
    if (type === 'task') {
      document.getElementById('task-title').value = '';
      document.getElementById('task-description').value = '';
      document.getElementById('task-due-date').value = '';
    } else if (type === 'reminder') {
      document.getElementById('reminder-text').value = '';
      document.getElementById('reminder-time').value = '';
    } else if (type === 'note') {
      document.getElementById('note-title').value = '';
      document.getElementById('note-content').value = '';
    }
  }
  
  // Save task
  saveTask() {
    const titleElem = document.getElementById('task-title');
    const descriptionElem = document.getElementById('task-description');
    const dueDateElem = document.getElementById('task-due-date');
    
    const title = titleElem.value.trim();
    const description = descriptionElem.value.trim();
    const dueDate = dueDateElem.value;
    
    if (!title) {
      alert('Please enter a task title.');
      return;
    }
    
    const task = {
      id: Date.now(),
      title,
      description,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.tasks.push(task);
    this.saveData();
    this.renderTasks();
    this.hideForm('task');
    this.updateAmiSuggestions();
  }
  
  // Save reminder
  saveReminder() {
    const textElem = document.getElementById('reminder-text');
    const timeElem = document.getElementById('reminder-time');
    
    const text = textElem.value.trim();
    const time = timeElem.value;
    
    if (!text) {
      alert('Please enter reminder text.');
      return;
    }
    
    if (!time) {
      alert('Please select a reminder time.');
      return;
    }
    
    const reminder = {
      id: Date.now(),
      text,
      time,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.reminders.push(reminder);
    this.saveData();
    this.renderReminders();
    this.hideForm('reminder');
    this.updateAmiSuggestions();
  }
  
  // Save note
  saveNote() {
    const titleElem = document.getElementById('note-title');
    const contentElem = document.getElementById('note-content');
    
    const title = titleElem.value.trim();
    const content = contentElem.value.trim();
    
    if (!title) {
      alert('Please enter a note title.');
      return;
    }
    
    if (!content) {
      alert('Please enter note content.');
      return;
    }
    
    const note = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toISOString()
    };
    
    this.notes.push(note);
    this.saveData();
    this.renderNotes();
    this.hideForm('note');
  }
  
  // Complete task
  completeTask(id) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      this.saveData();
      this.renderTasks();
      this.updateAmiSuggestions();
    }
  }
  
  // Complete reminder
  completeReminder(id) {
    const reminderIndex = this.reminders.findIndex(reminder => reminder.id === id);
    if (reminderIndex !== -1) {
      this.reminders[reminderIndex].completed = !this.reminders[reminderIndex].completed;
      this.saveData();
      this.renderReminders();
    }
  }
  
  // Delete task
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveData();
    this.renderTasks();
    this.updateAmiSuggestions();
  }
  
  // Delete reminder
  deleteReminder(id) {
    this.reminders = this.reminders.filter(reminder => reminder.id !== id);
    this.saveData();
    this.renderReminders();
  }
  
  // Delete note
  deleteNote(id) {
    this.notes = this.notes.filter(note => note.id !== id);
    this.saveData();
    this.renderNotes();
  }
  
  // Render tasks
  renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    
    if (!tasksList || !this.isInitialized) return;
    
    if (this.tasks.length === 0) {
      tasksList.innerHTML = '<div class="text-gray-500 text-center py-4">No tasks yet</div>';
      return;
    }
    
    // Sort tasks by due date and completion status
    const sortedTasks = [...this.tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    tasksList.innerHTML = sortedTasks.map(task => {
      const isOverdue = !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
      
      return `
        <div class="bg-white rounded-md p-3 shadow-sm border ${task.completed ? 'border-green-200' : isOverdue ? 'border-red-200' : 'border-gray-200'}">
          <div class="flex items-start">
            <div class="mr-2 mt-1">
              <input type="checkbox" ${task.completed ? 'checked' : ''} 
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                onchange="workAssistant.completeTask(${task.id})">
            </div>
            <div class="flex-1">
              <div class="${task.completed ? 'line-through text-gray-500' : ''}">
                <div class="font-medium">${task.title}</div>
                ${task.description ? `<div class="text-sm text-gray-600 mt-1">${task.description}</div>` : ''}
              </div>
              <div class="flex justify-between items-center mt-2">
                <div class="text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}">
                  ${isOverdue ? 'Overdue: ' : 'Due: '}${this.formatDate(task.dueDate)}
                </div>
                <button class="text-gray-400 hover:text-red-600 focus:outline-none" 
                  onclick="workAssistant.deleteTask(${task.id})">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Render reminders
  renderReminders() {
    const remindersList = document.getElementById('reminders-list');
    
    if (!remindersList || !this.isInitialized) return;
    
    if (this.reminders.length === 0) {
      remindersList.innerHTML = '<div class="text-gray-500 text-center py-4">No reminders yet</div>';
      return;
    }
    
    // Sort reminders by time and completion status
    const sortedReminders = [...this.reminders].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.time) - new Date(b.time);
    });
    
    remindersList.innerHTML = sortedReminders.map(reminder => {
      const isOverdue = !reminder.completed && new Date(reminder.time) < new Date();
      
      return `
        <div class="bg-white rounded-md p-3 shadow-sm border ${reminder.completed ? 'border-green-200' : isOverdue ? 'border-red-200' : 'border-gray-200'}">
          <div class="flex items-start">
            <div class="mr-2 mt-1">
              <input type="checkbox" ${reminder.completed ? 'checked' : ''} 
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                onchange="workAssistant.completeReminder(${reminder.id})">
            </div>
            <div class="flex-1">
              <div class="${reminder.completed ? 'line-through text-gray-500' : ''}">
                <div class="font-medium">${reminder.text}</div>
              </div>
              <div class="flex justify-between items-center mt-2">
                <div class="text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}">
                  ${isOverdue ? 'Overdue: ' : 'At: '}${this.formatDateTime(reminder.time)}
                </div>
                <button class="text-gray-400 hover:text-red-600 focus:outline-none" 
                  onclick="workAssistant.deleteReminder(${reminder.id})">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Render notes
  renderNotes() {
    const notesList = document.getElementById('notes-list');
    
    if (!notesList || !this.isInitialized) return;
    
    if (this.notes.length === 0) {
      notesList.innerHTML = '<div class="text-gray-500 text-center py-4">No notes yet</div>';
      return;
    }
    
    // Sort notes by creation date (newest first)
    const sortedNotes = [...this.notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    notesList.innerHTML = sortedNotes.map(note => {
      return `
        <div class="bg-white rounded-md p-3 shadow-sm border border-gray-200">
          <div class="flex justify-between items-start">
            <div class="font-medium">${note.title}</div>
            <button class="text-gray-400 hover:text-red-600 focus:outline-none" 
              onclick="workAssistant.deleteNote(${note.id})">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="text-sm text-gray-600 mt-1">${note.content}</div>
          <div class="text-xs text-gray-500 mt-2">
            ${this.formatDateTime(note.createdAt)}
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Update AMI suggestions
  updateAmiSuggestions() {
    const suggestions = document.getElementById('ami-suggestions');
    
    if (!suggestions) return;
    
    // Count completed and pending tasks
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const pendingTasks = this.tasks.filter(task => !task.completed).length;
    
    // Check for overdue tasks
    const overdueTasks = this.tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0)
    );
    
    // Generate suggestions based on data
    let suggestionText = '';
    
    if (this.tasks.length === 0) {
      suggestionText = `
        <p>Add your first task to get started! I'll help you stay organized and focused on your career goals.</p>
        <p class="mt-2">Try adding tasks related to your job search, learning goals, or networking activities.</p>
      `;
    } else {
      suggestionText = `
        <p>You have completed ${completedTasks} task${completedTasks !== 1 ? 's' : ''} and have ${pendingTasks} pending task${pendingTasks !== 1 ? 's' : ''}.</p>
      `;
      
      if (overdueTasks.length > 0) {
        suggestionText += `
          <p class="mt-2">You have ${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''}. Consider prioritizing:</p>
          <ul class="list-disc list-inside mt-1">
            ${overdueTasks.slice(0, 2).map(task => `<li>${task.title}</li>`).join('')}
            ${overdueTasks.length > 2 ? `<li>...and ${overdueTasks.length - 2} more</li>` : ''}
          </ul>
        `;
      }
      
      // Add productivity tips
      const tips = [
        'Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break.',
        'Break large tasks into smaller, manageable chunks to make progress more visible.',
        'Consider scheduling your most challenging tasks during your peak productivity hours.',
        'Set clear deadlines for ambiguous tasks to avoid procrastination.',
        'Take short breaks between tasks to maintain focus and productivity.',
        'Review your task list at the end of each day and plan for tomorrow.'
      ];
      
      suggestionText += `
        <p class="mt-2">Productivity tip: ${tips[Math.floor(Math.random() * tips.length)]}</p>
      `;
    }
    
    suggestions.innerHTML = suggestionText;
  }
  
  // Format date
  formatDate(dateString) {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
  
  // Format date and time
  formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'No date';
    
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }
  
  // Load data from localStorage
  loadData() {
    try {
      const tasksData = localStorage.getItem('workAssistant_tasks');
      const remindersData = localStorage.getItem('workAssistant_reminders');
      const notesData = localStorage.getItem('workAssistant_notes');
      
      this.tasks = tasksData ? JSON.parse(tasksData) : this.getDemoTasks();
      this.reminders = remindersData ? JSON.parse(remindersData) : this.getDemoReminders();
      this.notes = notesData ? JSON.parse(notesData) : this.getDemoNotes();
    } catch (e) {
      console.error('Error loading work assistant data', e);
      this.tasks = this.getDemoTasks();
      this.reminders = this.getDemoReminders();
      this.notes = this.getDemoNotes();
    }
  }
  
  // Save data to localStorage
  saveData() {
    try {
      localStorage.setItem('workAssistant_tasks', JSON.stringify(this.tasks));
      localStorage.setItem('workAssistant_reminders', JSON.stringify(this.reminders));
      localStorage.setItem('workAssistant_notes', JSON.stringify(this.notes));
    } catch (e) {
      console.error('Error saving work assistant data', e);
    }
  }
  
  // Render all data
  renderData() {
    this.renderTasks();
    this.renderReminders();
    this.renderNotes();
    this.updateAmiSuggestions();
  }
  
  // Get demo tasks
  getDemoTasks() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
      {
        id: 1,
        title: 'Update resume with latest experience',
        description: 'Add recent project and skills from TechCorp',
        dueDate: tomorrow.toISOString().substr(0, 10),
        completed: false,
        createdAt: today.toISOString()
      },
      {
        id: 2,
        title: 'Apply for Senior Developer position',
        description: 'At InnovateTech company',
        dueDate: nextWeek.toISOString().substr(0, 10),
        completed: false,
        createdAt: today.toISOString()
      },
      {
        id: 3,
        title: 'Complete LinkedIn profile update',
        description: '',
        dueDate: today.toISOString().substr(0, 10),
        completed: true,
        createdAt: new Date(today.setDate(today.getDate() - 2)).toISOString()
      }
    ];
  }
  
  // Get demo reminders
  getDemoReminders() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const later = new Date(today);
    later.setHours(today.getHours() + 3);
    
    return [
      {
        id: 1,
        text: 'Phone interview with TechCorp',
        time: later.toISOString().substr(0, 16),
        completed: false,
        createdAt: today.toISOString()
      },
      {
        id: 2,
        text: 'Follow up with networking contact',
        time: tomorrow.toISOString().substr(0, 16),
        completed: false,
        createdAt: today.toISOString()
      }
    ];
  }
  
  // Get demo notes
  getDemoNotes() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        id: 1,
        title: 'Interview Preparation',
        content: 'Research company values, prepare STAR method answers, review technical concepts.',
        createdAt: today.toISOString()
      },
      {
        id: 2,
        title: 'Career Development Ideas',
        content: 'Look into cloud certification, join a tech meetup group, start a side project.',
        createdAt: yesterday.toISOString()
      }
    ];
  }
}

// Initialize work assistant when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if tasks section exists
  if (document.getElementById('tasks-section')) {
    window.workAssistant = new WorkAssistant();
    window.workAssistant.init();
  }
}); 