// hub.sazi.life.v2/assets/js/quiz.js

import { quizDatabase } from './quiz-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    let userState = {
        level: 0,
        categoryIndex: 0,
        questionIndex: 0,
        answers: [],
    };

    const loadProgress = () => {
        const savedProgress = localStorage.getItem('guestQuizProgress');
        if (savedProgress) {
            userState = JSON.parse(savedProgress);
        }
    };

    const saveProgress = () => {
        localStorage.setItem('guestQuizProgress', JSON.stringify(userState));
    };

    const renderQuiz = () => {
        const currentLevelData = quizDatabase.levels[userState.level];
        if (!currentLevelData) {
            renderCompletionScreen();
            return;
        }

        const currentCategoryData = currentLevelData.categories[userState.categoryIndex];
        if (!currentCategoryData) {
            userState.level++;
            userState.categoryIndex = 0;
            userState.questionIndex = 0;
            saveProgress();
            renderLevelUpScreen(currentLevelData);
            return;
        }

        const currentQuestionData = currentCategoryData.questions[userState.questionIndex];
        if (!currentQuestionData) {
            userState.categoryIndex++;
            userState.questionIndex = 0;
            saveProgress();
            renderQuiz();
            return;
        }
        
        // ... (rest of the rendering logic is the same)
        const totalQuestionsInLevel = quizDatabase.levels[userState.level].categories.reduce((acc, cat) => acc + cat.questions.length, 0);
        const questionsAnsweredInLevel = quizDatabase.levels[userState.level].categories
            .slice(0, userState.categoryIndex)
            .reduce((acc, cat) => acc + cat.questions.length, 0) + userState.questionIndex;
        const progressPercentage = (questionsAnsweredInLevel / totalQuestionsInLevel) * 100;

        quizContainer.innerHTML = `
            <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width: ${progressPercentage}%"></div></div>
            <div class="p-8">
                <p class="text-sm font-semibold text-blue-600">${currentLevelData.title} - ${currentCategoryData.name}</p>
                <h2 class="text-2xl font-bold text-gray-800 mt-2">${currentQuestionData.q}</h2>
                <div class="mt-6 space-y-3">
                    ${currentQuestionData.a.map((answer, index) => `
                        <button class="quiz-option" data-answer-index="${index}">${answer}</button>
                    `).join('')}
                </div>
            </div>
        `;
        
        quizContainer.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', handleAnswer);
        });
    };

    const handleAnswer = (e) => {
        const answerIndex = e.target.dataset.answerIndex;
        userState.answers.push({ /* ... answer data ... */ });
        userState.questionIndex++;
        saveProgress();
        renderQuiz();
    };

    const renderLevelUpScreen = (completedLevel) => {
        quizContainer.innerHTML = `
            <div class="p-8 text-center">
                <div class="achievement-card p-6">
                    <i class="fas fa-trophy text-4xl text-emerald-500"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mt-4">Level Complete!</h2>
                    <p class="text-gray-600">You've completed "${completedLevel.title}". Your insights are ready.</p>
                </div>
                <div class="mt-6 grid sm:grid-cols-2 gap-4">
                    <button id="next-level-btn" class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Continue Quiz</button>
                    <button id="save-progress-btn" class="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700">Save to LifeCV</button>
                </div>
            </div>
        `;
        document.getElementById('next-level-btn').addEventListener('click', renderQuiz);
        document.getElementById('save-progress-btn').addEventListener('click', () => {
            // On clicking save, redirect to the login page.
            // A more advanced implementation could pass the results in the URL to be saved after login.
            window.location.href = 'login.html';
        });
    };
    
    // ... (rest of the functions, e.g., renderCompletionScreen, are similar)

    loadProgress();
    renderQuiz();
});
