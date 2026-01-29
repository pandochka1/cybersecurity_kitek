// Основная логика квиза
const QuizApp = {
    currentPage: 0,
    score: 0,
    userName: '',
    answers: [],

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.elements = {
            namePage: document.getElementById('name-page'),
            quizContainer: document.getElementById('quiz-container'),
            resultsPage: document.getElementById('results-page')
        };
    },

    bindEvents() {
        // События привязываются динамически
    },

    start() {
        this.userName = document.getElementById('userName').value.trim();
        if (!this.userName) return alert('Введите ФИО!');
        this.currentPage = 0;
        this.score = 0;
        this.answers = new Array(quizData.length).fill(null);
        this.showPage('quiz');
        this.loadQuestion(0);
    },

    showPage(type) {
        Object.values(this.elements).forEach(page => page.classList.remove('active'));
        if (type === 'name') {
            this.elements.namePage.classList.add('active');
        } else if (type === 'quiz') {
            this.elements.quizContainer.classList.add('active');
        } else if (type === 'results') {
            this.elements.resultsPage.classList.add('active');
            this.showResults();
        }
    },

    loadQuestion(index) {
        this.elements.quizContainer.innerHTML = this.createQuestionHTML(index);
        const progress = ((index + 1) / quizData.length) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
    },

    createQuestionHTML(index) {
        const q = quizData[index];
        return `
            <div class="progress"><div class="progress-bar"></div></div>
            <div class="question">${index + 1}. ${q.question}</div>
            <ul class="options">
                ${q.options.map((opt, i) => 
                    `<li class="option" onclick="QuizApp.selectOption(${index}, ${i}, ${q.correct === i})">${opt}</li>`
                ).join('')}
            </ul>
            <div class="feedback" id="feedback-${index}"></div>
            <button class="btn-primary" id="nextBtn" disabled onclick="QuizApp.nextQuestion()">Далее</button>
        `;
    },

    selectOption(qIndex, optIndex, isCorrect) {
        // Снимаем выделение со всех
        document.querySelectorAll('.option').forEach((opt, i) => {
            opt.classList.remove('selected');
            if (i === optIndex) opt.classList.add('selected');
        });

        // Показываем фидбек
        const feedback = document.getElementById(`feedback-${qIndex}`);
        feedback.innerHTML = `<strong>${isCorrect ? '✅ Верно!' : '❌ Неверно'}</strong><br>${quizData[qIndex].explanation}`;
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.style.display = 'block';

        document.getElementById('nextBtn').disabled = false;
        if (isCorrect) this.score++;
        this.answers[qIndex] = { selected: optIndex, correct: isCorrect };
    },

    nextQuestion() {
        if (this.currentPage < quizData.length - 1) {
            this.currentPage++;
            this.loadQuestion(this.currentPage);
        } else {
            this.showPage('results');
        }
    },

    showResults() {
        const percent = Math.round((this.score / quizData.length) * 100);
        document.getElementById('finalScore').textContent = `${this.score}/10 (${percent}%)`;
        document.getElementById('finalProgress').style.width = `${percent}%`;

        const result = `${this.userName}: ${this.score}/10 (${percent}%)`;
        let history = JSON.parse(localStorage.getItem('quizResults') || '[]');
        history.unshift(result);
        localStorage.setItem('quizResults', JSON.stringify(history.slice(0, 10)));

        document.getElementById('resultsList').innerHTML = history.map(r => 
            `<div class="result-item">${r}</div>`
        ).join('');
    },

    reset() {
        this.showPage('name');
    }
};
