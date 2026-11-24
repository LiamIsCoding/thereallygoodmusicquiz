import { useState } from "react";
import './styles/make_page.css'

function MakePage() {
    // Default new question constructor
    const newQuestion = () => ({options: ["", "", "", ""], correct: 0});
    
    // All quizzes for writing
    const [quizzes, setQuizzes] = useState({});

    // Submitting state, to prevent double clicks from saving multiple times
    const [submitting, setSubmitting] = useState(false);

    // Message shown after submitting, e.g. { type: "success", text: "Quiz saved!" }
    // (so people, including screen reader users, know whether it worked)
    const [message, setMessage] = useState(null);

    // Quiz information
    const [name, setName] = useState("");
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

    async function handleSubmit(event) {
        event.preventDefault();

        // Check whether currently submitting
        if(submitting){
            return;
        }
        setSubmitting(true);
        setMessage(null);

        try {
            // Attempt to save new quiz to cloud
            const response = await fetch("/.netlify/functions/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, genre, timer, questions }),
            })

            // Reset page if successfully saved
            if(response.ok){
                // Update quiz information
                setQuizzes(await response.json());
                
                // Reset form
                setName("");
                setGenre("");
                setTimer(5);
                setQuestions([newQuestion()]);

                setMessage({ type: "success", text: `Quiz "${name}" saved! You can find it on Browse Quizzes.` });
            }
            else {
                setMessage({ type: "error", text: "Couldn't save the quiz. Please try again." });
            }
        }
        catch {
            // e.g. no internet connection
            setMessage({ type: "error", text: "Couldn't save the quiz. Check your connection and try again." });
        }
        finally{
            setSubmitting(false);
        }
    }
    
    return (
        <section aria-labelledby="make-heading">
            <h2 id="make-heading">Make a Quiz</h2>

            <form onSubmit={handleSubmit}>
                {/* Visible <label>s (htmlFor matches the input's id) so everyone can see what each box is for,
                    even after typing (placeholders disappear) */}

                {/* Quiz Name */}
                <div className="make-field">
                    <label htmlFor="make-name">Quiz name</label>
                    <input id="make-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter a quiz name..." required />
                </div>
                
                {/* Genre */}
                <div className="make-field">
                    <label htmlFor="make-genre">Genre</label>
                    <input id="make-genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Enter a genre..." required />
                </div>

                {/* Timer */}
                <div className="make-field">
                    <label htmlFor="make-timer">Timer (seconds)</label>
                    <input id="make-timer" type="number" min="1" value={timer} onChange={(e) => setTimer(e.target.value)} placeholder="Time to answer..." required />
                </div>

                {/* Questions */}
                <ol>
                    {questions.map((question, questionNum) => (
                        <li key={questionNum} className="make-questions">
                            <h3 id={`question-${questionNum}`}>Question {questionNum + 1}</h3>
                            <p className="make-hint">Pick the correct answer</p>

                            {/* Options, grouped as one radio group named by the question heading
                                (the group is a wrapper div so the <ul> stays a real list) */}
                            <div role="radiogroup" aria-labelledby={`question-${questionNum}`}>
                            <ul>
                                {question.options.map((option, optionNum) => (
                                    <li key={optionNum} className="make-options">
                                        {/* Correct option */}
                                        {/* Each label says which question and answer it is, e.g. "Question 1, answer 2 is correct",
                                            so screen reader users can tell the boxes apart */}
                                        <input aria-label={`Question ${questionNum + 1}, answer ${optionNum + 1} is correct`} type="radio" name={`correct-${questionNum}`} checked={question.correct === optionNum} onChange={() => updateCorrect(questionNum, optionNum)} />
                                        
                                        {/* Options */}
                                        <input aria-label={`Question ${questionNum + 1}, answer ${optionNum + 1}`} value={option} onChange={(e) => updateOption(questionNum, optionNum, e.target.value)} placeholder="Answer here..." required />
                                    </li>
                                ))}
                            </ul>
                            </div>
                        </li>
                    ))}
                </ol>

                <button type="button" onClick={addQuestion}>Add Question</button>
                
                <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Submit Quiz"}</button>

                {/* Result of submitting: role="status" / role="alert" makes screen readers read it out */}
                {message && (
                    <p className={`make-message make-${message.type}`} role={message.type === "error" ? "alert" : "status"}>
                        {message.text}
                    </p>
                )}
            </form>
        </section>
    )
}

export default MakePage