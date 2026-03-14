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

    // Pre-defined questions per level (demo; expand as needed)
    const data = {
        1: {
            questions: [
                { q: "谁有苹果？", a: ["我", "你", "他"], correct: 0 },
                { q: "他们喜欢什么？", a: ["学习", "吃饭", "睡觉"], correct: 1 }
            ]
        },
        2: {
            questions: [
                { q: "今天是星期几？", a: ["一", "二", "三"], correct: 0 },
                { q: "他在哪里吃饭？", a: ["家", "学校", "公园"], correct: 1 }
            ]
        },
        3: {
            questions: [
                { q: "他们去哪里旅游？", a: ["公园", "学校", "家里"], correct: 0 },
                { q: "他们在旅游中学到了什么？", a: ["新知识", "新语言", "新朋友"], correct: 0 }
            ]
        },
        4: {
            questions: [
                { q: "他们参加了什么活动？", a: ["文化交流活动", "体育比赛", "音乐会"], correct: 0 },
                { q: "他们通过活动获得了什么？", a: ["深入了解", "奖品", "证书"], correct: 0 }
            ]
        },
        5: {
            questions: [
                { q: "他们面对的主要挑战是什么？", a: ["激烈竞争", "语言障碍", "资金不足"], correct: 0 },
                { q: "他们如何克服困难？", a: ["不断创新", "寻求帮助", "放弃计划"], correct: 0 }
            ]
        },
        6: {
            questions: [
                { q: "他们坚持什么？", a: ["学习", "放弃", "休息"], correct: 0 },
                { q: "这种精神是什么？", a: ["懒惰", "坚持", "自私"], correct: 1 }
            ]
        }
    };

    // Helper to format a list with "和" for the last item
    const formatList = (items) => {
        if (items.length === 0) return '';
        if (items.length === 1) return items[0];
        return items.slice(0, -1).join('、') + '和' + items[items.length - 1];
    };

    generateBtn.addEventListener('click', () => {
        const vocab = vocabInput.value.split(',').map(v => v.trim());
        const level = levelSelect.value;
        if (!vocab.length || vocab[0] === '') return alert('Enter vocabulary!');

        // Generate cohesive reading text incorporating all vocab naturally
        let text;
        const extras = vocab.slice(3);
        if (level == 1) {
            text = `我有${vocab[0] || '苹果'}。我喜欢${vocab[1] || '朋友'}。我们喜欢${vocab[2] || '学习'}${extras.length ? '。我还喜欢' + formatList(extras) : ''}。`;
        } else if (level == 2) {
            text = `今天是星期${vocab[0] || '一'}。我在${vocab[1] || '家'}吃饭。我的${vocab[2] || '朋友'}来了${extras.length ? '。我还喜欢' + formatList(extras) : ''}。`;
        } else if (level == 3) {
            text = `上个周末，我和朋友去${vocab[0] || '公园'}旅游。我们在那里学到了很多${vocab[1] || '新知识'}。${vocab[2] || '大家'}都觉得这次旅游很有意思${extras.length ? '。我们还体验了' + formatList(extras) : ''}。`;
        } else if (level == 4) {
            text = `我们参加了一次${vocab[0] || '文化交流'}活动，通过活动对${vocab[1] || '当地文化'}有了更深入的了解。活动中，${vocab[2] || '大家'}积极互动，分享各自的经历${extras.length ? '。活动内容还包括' + formatList(extras) : ''}。`;
        } else if (level == 5) {
            text = `在当今${vocab[0] || '竞争'}激烈的社会中，我们面临着各种挑战。只有不断${vocab[1] || '创新'}，才能在变化中找到机遇。面对${vocab[2] || '困境'}，我们要保持积极的心态，勇于突破自我${extras.length ? '。此外，我们还需重视' + formatList(extras) : ''}。`;
        } else {
            // Level 6: complex, literary style
            text = `尽管${vocab[0] || '困难'}重重，我们仍坚持${vocab[1] || '学习'}，不断探索未知的领域。这种${vocab[2] || '精神'}不仅体现了人类对知识的渴望，更彰显了面对逆境时的坚韧与智慧${extras.length ? '。与此同时，' + formatList(extras) + '也在其中发挥了不可忽视的作用' : ''}。`;
        }
        textP.textContent = text;
        currentQuestions = data[level].questions;

        questionsForm.innerHTML = currentQuestions.map((q, i) => `
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
