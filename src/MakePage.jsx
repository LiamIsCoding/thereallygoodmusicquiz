import { useState } from "react";

function MakePage() {
    // Default new question constructor
    const newQuestion = () => ({options: ["", "", "", ""], correct: 0});
    
    // Quiz information
    const [quizName, setQuizName] = useState("");
    const [genre, setGenre] = useState("");
    const [timer, setTimer] = useState(5);
    const [questions, setQuestions] = useState([newQuestion()]);

    // Add a new question to the quiz
    const addQuestion = () => {
        setQuestions((oldValue) => [...oldValue, newQuestion()])
    }

    // Update logic for options
    const updateOption = (questionNum, optionNum, newValue) => {
        // Pass current value
        setQuestions((oldValue) => {
            // Copy to not mutate
            const updated = structuredClone(oldValue);

            // Update value at the index
            updated[questionNum].options[optionNum] = newValue;
            return updated;
        });
    }

    // Update logic for correct answer
    const updateCorrect = (questionNum, optionNum) => {
        // Pass current value
        setQuestions((oldValue) => {
            // Copy to not mutate
            const updated = structuredClone(oldValue);

            // Update to the correct option at the index
            updated[questionNum].correct = optionNum;
            return updated;
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        setQuizName("");
    }
    
    return (
        <section>
            <form onSubmit={handleSubmit}>
                {/* Quiz Name */}
                <div>
                    <input aria-label="Enter a quiz name" value={quizName} onChange={(e) => setQuizName(e.target.value)} placeholder="Enter a quiz name..." required />
                </div>
                
                {/* Genre */}
                <div>
                    <input aria-label="Enter a genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Enter a genre..." required />
                </div>

                {/* Timer */}
                <div>
                    <input aria-label="Timer" type="number" value={timer} onChange={(e) => setTimer(e.target.value)} placeholder="Time to answer..." required />
                </div>

                {/* Questions */}
                <ol>
                    {questions.map((question, questionNum) => (
                        <li key={questionNum} className="make-questions">
                            <h3>Question {questionNum + 1}</h3>

                            {/* Options */}
                            <ul>
                                {question.options.map((option, optionNum) => (
                                    <li key={optionNum} className="make-options">
                                        {/* Correct option */}
                                        <input aria-label="Correct Option" type="radio" name={`correct-${questionNum}`} checked={question.correct === optionNum} onChange={() => updateCorrect(questionNum, optionNum)} />
                                        
                                        {/* Options */}
                                        <input aria-label="Option" value={option} onChange={(e) => updateOption(questionNum, optionNum, e.target.value)} placeholder="Answer here..." required />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ol>

                <button type="button" onClick={addQuestion}>Add Question</button>
                
                <button aria-label="Submit quiz" type="submit" >Submit Quiz</button>
            </form>
        </section>
    )
}

export default MakePage