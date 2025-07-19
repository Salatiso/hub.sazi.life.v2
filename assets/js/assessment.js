// hub.sazi.life.v2/assets/js/assessment.js

document.addEventListener('DOMContentLoaded', () => {
    const wizardContainer = document.getElementById('assessment-wizard-container');
    if (!wizardContainer) return;

    const wizardData = {
        questions: {
            start: {
                question: "What is your primary goal today?",
                options: [
                    { text: "Organize my family life", next: "family_q" },
                    { text: "Manage my personal finances", next: "results_finhelp" },
                    { text: "Build my professional profile", next: "results_lifecv" },
                    { text: "Ensure safety compliance", next: "results_safetyhelp" }
                ]
            },
            family_q: {
                question: "What aspect of family life needs the most attention?",
                options: [
                    { text: "Tracking contributions and chores", next: "results_familyhub" },
                    { text: "Improving communication and decisions", next: "results_commshub" },
                    { text: "Guiding my children's development", next: "results_flamea" }
                ]
            }
        },
        results: {
            results_finhelp: { name: 'FinHelp', icon: 'fa-chart-pie', color: 'text-green-500', desc: 'The perfect tool for managing your assets, tracking expenses, and preparing for your financial future.', url: 'https://finhelp.salatiso.com' },
            results_lifecv: { name: 'LifeCV', icon: 'fa-id-card', color: 'text-indigo-500', desc: 'Build a dynamic, holistic profile of your skills, experiences, and achievements.', url: '#' },
            results_safetyhelp: { name: 'SafetyHelp', icon: 'fa-shield-alt', color: 'text-orange-500', desc: 'Simplify OHS compliance with AI-powered tools for your business or project.', url: 'https://safetyfirst.help' },
            results_familyhub: { name: 'FamilyHub', icon: 'fa-users', color: 'text-purple-500', desc: 'Organize your family, value every contribution, and build a shared legacy together.', url: '#' },
            results_commshub: { name: 'CommsHub', icon: 'fa-comments', color: 'text-sky-500', desc: 'Turn conversations into actions. The perfect tool for family councils and community groups.', url: '#' },
            results_flamea: { name: 'Flamea', icon: 'fa-fire', color: 'text-red-500', desc: 'A dedicated platform for building boys into men, and men into fathers and leaders.', url: 'https://flamea.org' }
        }
    };

    const renderStep = (stepId) => {
        const step = wizardData.questions[stepId];
        if (!step) {
            console.error("Wizard step not found:", stepId);
            return;
        }

        wizardContainer.innerHTML = `
            <h3 class="text-xl font-semibold text-gray-800 mb-4">${step.question}</h3>
            <div class="grid grid-cols-1 gap-3">
                ${step.options.map(opt => `<button class="wizard-option p-4 bg-gray-100 hover:bg-blue-100 rounded-lg" data-next="${opt.next}">${opt.text}</button>`).join('')}
            </div>
             <button id="wizard-back-btn" class="text-sm text-gray-500 hover:underline mt-4">Back</button>
        `;
        attachListeners();
    };

    const renderResults = (resultKey) => {
        const result = wizardData.results[resultKey];
        wizardContainer.innerHTML = `
            <div class="p-4 bg-blue-50 rounded-lg text-center">
                <i class="fas ${result.icon} ${result.color} text-4xl mb-3"></i>
                <h3 class="text-2xl font-bold text-gray-800">We recommend: ${result.name}</h3>
                <p class="text-gray-600 my-2">${result.desc}</p>
                <a href="${result.url}" target="_blank" class="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg mt-2">Learn More</a>
                <button id="wizard-restart-btn" class="block w-full text-sm text-gray-500 hover:underline mt-4">Start Over</button>
            </div>
        `;
        attachListeners();
    };
    
    let history = ['start'];

    const attachListeners = () => {
        wizardContainer.querySelectorAll('.wizard-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const next = btn.dataset.next;
                history.push(next);
                if (next.startsWith('results_')) {
                    renderResults(next);
                } else {
                    renderStep(next);
                }
            });
        });

        const backBtn = wizardContainer.querySelector('#wizard-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                history.pop();
                const previousStep = history[history.length - 1];
                if (previousStep) {
                     if (previousStep.startsWith('results_')) {
                        renderResults(previousStep);
                    } else {
                        renderStep(previousStep);
                    }
                }
            });
        }
        
        const restartBtn = wizardContainer.querySelector('#wizard-restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                history = ['start'];
                renderStep('start');
            });
        }
    };

    renderStep('start');
});
