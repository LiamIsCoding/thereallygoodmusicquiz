import { useState } from "react";

function MakePage() {
    const [quizName, setQuizName] = useState("");
  
    function handleSubmit(event) {
        event.preventDefault();

        setQuizName("");
    }
    
    return (
        <section>
            <form onSubmit={handleSubmit}>
                <input aria-label="Enter a quiz name" value={quizName} onChange={(e) => setQuizName(e.target.value)} placeholder="Enter a quiz name..." />
                <button aria-label="Submit quiz" type="submit" >Submit Quiz</button>
            </form>
        </section>
    )
}

export default MakePage