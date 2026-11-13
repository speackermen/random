// ==========================================
// 1. АНИМАЦИЯ ФОНА (ЧАСТИЦЫ)
// ==========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#ff00ea';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 - distance / 600})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        p.update();
        p.draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();


// ==========================================
// 2. ЧАСЫ И ДАТА
// ==========================================
function updateClock() {
    const now = new Date();
    
    // Форматирование времени
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Форматирование даты
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('ru-RU', options);
    document.getElementById('date').textContent = dateString;
}
setInterval(updateClock, 1000);
updateClock();


// ==========================================
// 3. ИМИТАЦИЯ СИСТЕМНЫХ РЕСУРСОВ
// ==========================================
function updateSystemStatus() {
    const cpu = Math.floor(Math.random() * 60) + 20; // 20-80%
    const mem = Math.floor(Math.random() * 50) + 40; // 40-90%
    const net = Math.floor(Math.random() * 100);     // 0-100%

    document.getElementById('cpu-fill').style.width = `${cpu}%`;
    document.getElementById('mem-fill').style.width = `${mem}%`;
    document.getElementById('net-fill').style.width = `${net}%`;
}
setInterval(updateSystemStatus, 2500);
updateSystemStatus();


// ==========================================
// 4. СПИСОК ЗАДАЧ (MEMORY CORE)
// ==========================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('cyberdash_todos')) || [];

function saveTodos() {
    localStorage.setItem('cyberdash_todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');
        
        li.innerHTML = `
            <span style="cursor: pointer;" onclick="toggleTodo(${index})">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">&times;</button>
        `;
        todoList.appendChild(li);
    });
}

window.toggleTodo = function(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
};

window.deleteTodo = function(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
};

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
});

// Первичный рендер задач при загрузке
renderTodos();
