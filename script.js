document.addEventListener('DOMContentLoaded', () => {
    const vocabInput = document.getElementById('vocab');
    const levelSelect = document.getElementById('level');
    const generateBtn = document.getElementById('generate');
    const readingDiv = document.getElementById('reading');
    const textP = document.getElementById('text');
    const questionsForm = document.getElementById('questions');
    const submitBtn = document.getElementById('submit');
    const resultsDiv = document.getElementById('results');
    const scoreP = document.getElementById('score');
    const feedbackDiv = document.getElementById('feedback');
    const reminderP = document.getElementById('reminder');
    const retryBtn = document.getElementById('retry');

    let currentQuestions = [];
    let userAnswers = {};

    // Pre-defined reading texts and questions per level (demo; expand as needed)
    const data = {
        1: {
            template: "我有[0]。我喜欢[1]。我们是[2]。",
            questions: [
                { q: "谁有苹果？", a: ["我", "你", "他"], correct: 0 },
                { q: "他们喜欢什么？", a: ["学习", "吃饭", "睡觉"], correct: 1 }
            ]
        },
        2: {
            template: "今天是星期[0]。我在[1]吃饭。我的[2]来了。",
            questions: [
                { q: "今天是星期几？", a: ["一", "二", "三"], correct: 0 },
                { q: "他在哪里吃饭？", a: ["家", "学校", "公园"], correct: 1 }
            ]
        },
        // Add more levels similarly...
        6: {
            template: "尽管[0]困难，我们仍坚持[1]。这种[2]精神值得学习。",
            questions: [
                { q: "他们坚持什么？", a: ["学习", "放弃", "休息"], correct: 0 },
                { q: "这种精神是什么？", a: ["懒惰", "坚持", "自私"], correct: 1 }
            ]
        }
    };

    generateBtn.addEventListener('click', () => {
        const vocab = vocabInput.value.split(',').map(v => v.trim());
        const level = levelSelect.value;
        if (!vocab.length || vocab[0] === '') return alert('Enter vocabulary!');

        const { template, questions } = data[level];
        const text = template.replace(/\[(\d+)\]/g, (m, i) => vocab[i] || '[vocab]');
        textP.textContent = text;
        currentQuestions = questions;

        questionsForm.innerHTML = questions.map((q, i) => `
            <div class="question">
                <p>${q.q}</p>
                ${q.a.map((opt, j) => `<label><input type="radio" name="q${i}" value="${j}"> ${opt}</label><br>`).join('')}
            </div>
        `).join('');

        document.getElementById('setup').style.display = 'none';
        readingDiv.style.display = 'block';
    });

    submitBtn.addEventListener('click', () => {
        userAnswers = {};
        const formData = new FormData(questionsForm);
        for (let [key, value] of formData) {
            userAnswers[key] = parseInt(value);
        }

        let score = 0;
        const feedback = [];
        const mistakes = JSON.parse(localStorage.getItem('mistakes') || '[]');

        currentQuestions.forEach((q, i) => {
            const userAns = userAnswers[`q${i}`];
            const isCorrect = userAns === q.correct;
            if (isCorrect) score++;
            feedback.push(`<p class="${isCorrect ? 'correct' : 'incorrect'}">Q${i+1}: ${q.q} - Your answer: ${q.a[userAns] || 'None'} (${isCorrect ? 'Correct' : 'Incorrect. Correct: ' + q.a[q.correct]})</p>`);
            if (!isCorrect) mistakes.push({ question: q.q, user: q.a[userAns], correct: q.a[q.correct] });
        });

        scoreP.textContent = `Score: ${score}/${currentQuestions.length}`;
        feedbackDiv.innerHTML = feedback.join('');
        reminderP.textContent = mistakes.length ? 'Reminder: Take notes on these errors to avoid repeating them!' : '';
        localStorage.setItem('mistakes', JSON.stringify(mistakes.slice(-10))); // Keep last 10

        readingDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
    });

    retryBtn.addEventListener('click', () => {
        resultsDiv.style.display = 'none';
        document.getElementById('setup').style.display = 'block';
    });
});