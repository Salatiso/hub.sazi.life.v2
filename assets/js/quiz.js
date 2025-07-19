// hub.sazi.life.v2/assets/js/quiz.js

import { quizDatabase } from './quiz-database.js';
// In a full implementation, you would import Firebase to save/load progress
// import { db, auth } from './firebase-config.js'; 
// import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
        const savedProgress = localStorage.getItem('quizProgress');
        if (savedProgress) {
            userState = JSON.parse(savedProgress);
        }
        // In a real app, you'd fetch from Firestore here
    };

    const saveProgress = () => {
        localStorage.setItem('quizProgress', JSON.stringify(userState));
        // In a real app, you'd save to Firestore here
    };

    const renderQuiz = () => {
        const currentLevelData = quizDatabase.levels[userState.level];
        if (!currentLevelData) {
            renderCompletionScreen();
            return;
        }

        const currentCategoryData = currentLevelData.categories[userState.categoryIndex];
        if (!currentCategoryData) {
            // Level complete, move to next level
            userState.level++;
            userState.categoryIndex = 0;
            userState.questionIndex = 0;
            saveProgress();
            renderLevelUpScreen(currentLevelData);
            return;
        }

        const currentQuestionData = currentCategoryData.questions[userState.questionIndex];
        if (!currentQuestionData) {
            // Category complete, move to next category
            userState.categoryIndex++;
            userState.questionIndex = 0;
            saveProgress();
            renderQuiz(); // Re-render to check for next category or level
            return;
        }

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
        userState.answers.push({
            level: userState.level,
            category: quizDatabase.levels[userState.level].categories[userState.categoryIndex].name,
            question: quizDatabase.levels[userState.level].categories[userState.categoryIndex].questions[userState.questionIndex].q,
            answer: quizDatabase.levels[userState.level].categories[userState.categoryIndex].questions[userState.questionIndex].a[answerIndex],
        });
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
                    <p class="text-gray-600">You've completed "${completedLevel.title}". Your insights are shaping your LifeCV.</p>
                </div>
                <button id="next-level-btn" class="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Continue to Next Level</button>
            </div>
        `;
        document.getElementById('next-level-btn').addEventListener('click', renderQuiz);
    };
    
    const renderCompletionScreen = () => {
         quizContainer.innerHTML = `
            <div class="p-8 text-center">
                 <div class="achievement-card p-6">
                    <i class="fas fa-check-circle text-4xl text-emerald-500"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mt-4">Quiz Complete!</h2>
                    <p class="text-gray-600">You have completed all available levels. Your LifeCV is now richer with your self-assessment. Check back later for new levels!</p>
                </div>
                <button id="restart-quiz-btn" class="mt-6 w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700">Start Over</button>
            </div>
        `;
        document.getElementById('restart-quiz-btn').addEventListener('click', () => {
            userState = { level: 0, categoryIndex: 0, questionIndex: 0, answers: [] };
            saveProgress();
            renderQuiz();
        });
    }

    // --- Initial Load ---
    loadProgress();
    renderQuiz();
});
