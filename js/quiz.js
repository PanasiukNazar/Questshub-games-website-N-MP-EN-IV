const QUESTIONS = [
    {
        label: 'What strategy do you use to maximize your gaming success?',
        answers: [
            'I follow a strict gaming strategy that brings consistent rewards.',
            'I adapt my strategies based on the game situation.',
            'I rely on my intuition without a clear strategy.',
            'I am still exploring my best gaming approach.',
        ],
    },
    {
        label: 'Which gaming analysis tools do you use and why?',
        answers: [
            'Game mechanics analysis – it helps me optimize my playstyle.',
            'Player behavior analysis – I study my opponents and trends.',
            'Both methods, for a comprehensive approach.',
            'I don’t use analysis – I count on luck and excitement.',
        ],
    },
    {
        label: 'How do you handle emotional pressure during gaming sessions?',
        answers: [
            'I stick to my game plan and manage my bankroll wisely.',
            'Sometimes emotions take over, but I work on controlling them.',
            'I often let emotions affect my gameplay decisions.',
            'I don’t experience emotional pressure while gaming.',
        ],
    },
    {
        label: 'How do you measure your gaming success?',
        answers: [
            'By maintaining consistent winnings over time.',
            'By the number of successful rounds I play.',
            'By my total payouts over a set period.',
            'I don’t track my success yet – I focus on the thrill of the game.',
        ],
    },
    {
        label: 'Do you have a structured gaming plan, and how strictly do you follow it?',
        answers: [
            'I have a plan and always stick to it.',
            'I have a plan, but sometimes I deviate from it.',
            'I am developing my strategy but don’t have a solid plan yet.',
            'I play without a fixed plan and go with the flow.',
        ],
    },
];

const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content">
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <img class="quiz-img" src="images/quiz.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <h2 class="title">Assess Your Gaming Skills</h2>
                    <h3>Find out how well you understand strategy games, risk management, interactive gaming, and the thrill of virtual experience.</h3>
                    <button class="btn btn-primary py-3 first-button" data-action="startQuiz">Start</button>
                </div>
            </div>
        </div>
        `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content text-center">
                <h3>${question.label}</h3>
                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `<button class="answer col-md-12 col-lg-6 border rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>`
                        )
                        .join('')}
                </div>
            </div>
        </div>
        `;
    },
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

const finalStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content">
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <h2 class="title">Game Skill Review</h2>
                    <h3>Fill out the form to receive your free gaming strategy guide!</h3>
                    <form>
                        <input class="form-control" name="name" type="name" placeholder="Name" required>
                        <input class="form-control" name="email" id="email2" type="email" placeholder="Email" required>
                        <div id="validation" style="color: red"></div>
                        <input class="form-control" name="phone" type="number" id="phone" step="0.01" placeholder="Phone Number" required>
                        
                        <input name="strategyGaming" value="Gaming Strategy" hidden>
                        <input name="riskManagement" value="Risk Management" hidden>
                        <input name="interactiveGaming" value="Interactive Gaming" hidden>
                        <input name="virtualExperience" value="Virtual Experience" hidden>
                        <input name="highStakesEntertainment" value="High-Stakes Entertainment" hidden>
                        
                        <button data-action="submitAnswers" class="btn btn-primary w-50 py-3">Submit</button>
                    </form>
                </div>
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <img class="quiz-img" src="images/quiz-2.jpg">
                </div>
            </div>
        </div>
        `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'submitAnswers') {
            const emailInput = document.getElementById('email2').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(emailInput)) {
                document.getElementById('validation').textContent = '';
                window.location.href = 'thanks.html';
                localStorage.setItem('quizDone', true);
                document.getElementById('quiz-page').classList.add('hide');
            } else {
                document.getElementById('validation').textContent =
                    'Invalid email address. Please enter a valid email.';
            }
        }
    },
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    quiz.init();
    quiz.render();
}