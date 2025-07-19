// hub.sazi.life.v2/assets/js/quiz-database.js

export const quizDatabase = {
    levels: [
        {
            level: 1,
            title: "The Foundation",
            description: "Understanding your core principles and how you see the world.",
            categories: [
                {
                    name: "Live: Your Roots",
                    questions: [
                        { q: "When faced with an unexpected setback, my first reaction is to:", a: ["Analyze what went wrong.", "Seek advice from someone I trust.", "Take a moment to process before acting.", "Focus immediately on a new solution."] },
                        { q: "I feel most connected to my community when I am:", a: ["Sharing a meal or story.", "Working on a shared project.", "Helping someone in need.", "Celebrating a collective achievement."] },
                        { q: "The phrase 'home' primarily means to me:", a: ["A place of physical safety and comfort.", "The people I share my life with.", "A sense of belonging and identity.", "A base from which to explore the world."] },
                        { q: "I learned my most valuable life lesson from:", a: ["A personal failure.", "A wise elder or mentor.", "A period of quiet reflection.", "Observing the success of others."] },
                        { q: "When I think about my childhood, I am most grateful for:", a: ["The challenges that made me stronger.", "The support system I had.", "The freedom I had to explore.", "The stability and routine."] },
                    ]
                },
                {
                    name: "Learn: Your Curiosity",
                    questions: [
                        { q: "When I encounter a topic I know nothing about, I am most likely to:", a: ["Look up a quick summary online.", "Find a book or documentary about it.", "Ask an expert to explain it to me.", "Try to relate it to something I already know."] },
                        { q: "I believe the primary purpose of education is:", a: ["To acquire practical skills for a career.", "To broaden one's understanding of the world.", "To develop critical thinking abilities.", "To pass on cultural knowledge."] },
                        { q: "A new idea that challenges my long-held beliefs is:", a: ["A threat to be defended against.", "An opportunity to reconsider my views.", "Interesting, but unlikely to change my mind.", "Something to be tested with evidence."] },
                        { q: "I prefer to learn by:", a: ["Doing and experimenting.", "Reading and studying.", "Listening and discussing.", "Watching and observing."] },
                        { q: "The most important quality in a teacher or mentor is:", a: ["Expertise in their subject.", "Patience and understanding.", "The ability to inspire.", "Honesty and directness."] },
                    ]
                },
                {
                    name: "Lead: Your First Step",
                    questions: [
                        { q: "When I see a small problem in my community (e.g., litter), I tend to:", a: ["Clean it up myself if I can.", "Mention it to someone who might be responsible.", "Assume someone else will handle it.", "Feel annoyed but do nothing."] },
                        { q: "Leadership, to me, is primarily about:", a: ["Taking charge and making decisions.", "Empowering others to succeed.", "Setting a good example.", "Organizing people towards a common goal."] },
                        { q: "When working in a team, I naturally gravitate towards:", a: ["Planning and organizing the tasks.", "Mediating disagreements and ensuring harmony.", "Focusing on my individual contribution.", "Encouraging and motivating others."] },
                        { q: "Taking responsibility for a mistake is:", a: ["Difficult but necessary for growth.", "A sign of weakness.", "Something to be done only if caught.", "Crucial for maintaining trust."] },
                        { q: "The best way to influence others is through:", a: ["Logical arguments and data.", "Shared values and emotional connection.", "Leading by example.", "Clear instructions and authority."] },
                    ]
                }
            ]
        },
        // Add more levels here...
        // For brevity, only Level 1 is fully detailed. The structure can hold 150+ questions.
    ]
};
