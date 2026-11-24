// AI ASSISTED: Made based on ai-generated boilerplate

import {getStore} from "@netlify/blobs";

export default async (req) => {
    const store = getStore("quiz-data");

    // Access quizzes
    let quizzes = await store.get("quizzes", {type: "json"});
        
    // Initialize quizzes if they don't exist
    if(!quizzes){
        quizzes = {};
    }

    // POST
    if(req.method == "POST"){
        // Quiz to be added
        const quiz = await req.json();

        // Add quiz to quizzes
        quizzes[Object.keys(quizzes).length] =  {
            name: quiz.name,
            genre: quiz.genre,
            timer: Number(quiz.timer),
            questions: quiz.questions
        };

        // Store as a .json
        await store.setJSON("quizzes", quizzes);
        return Response.json(quizzes)
    }

    // GET
    if(req.method == "GET"){
        // Return as a .json, since we use .json format
        return Response.json(quizzes);
    }

    return new Response("Method not allowed", { status: 405 });
}