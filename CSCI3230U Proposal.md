**Proposal: The Really Good Music Quiz**

**Topic**  
The Really Good Music Quiz is an interactive music guessing game where the players test their knowledge of music by attempting to guess the names of the songs and which artists they were performed by. The application will use the music data from the [Last.fm](http://Last.fm) API to create quiz questions for the player while also providing information about the songs and artists. The players will be able to answer questions, receive feedback and be scored based on their performance. This application is for music lovers and is a simple, fun way to enhance and test their music knowledge.

**Data Source**  
The application will use the [Last.fm](http://Last.fm) API to get information to generate the quiz. The API will provide information about different tracks and artists such as the track name, artist name and the listeners. We will be using methods like chart.getTopTracks to get songs for generating the quiz questions. The API will use an API key and the responses will be requested in JSON format

**Sample response when asked for top 5 rock songs:**  
{  
&emsp;tracks: {  
&emsp;&emsp;track: \[ \[Object\], \[Object\], \[Object\], \[Object\], \[Object\] \],  
&emsp;&emsp;'@attr': {  
&emsp;&emsp;tag: 'rock',  
&emsp;&emsp;page: '1',  
&emsp;&emsp;perPage: '5',  
&emsp;&emsp;totalPages: '414',  
&emsp;&emsp;total: '2068'  
&emsp;&emsp;}  
&emsp;}  
} 

**Comparators**  
SongSpot \- A music guessing game where players guess a song from a very short 0.1 second audio clip and increases the length of the clip when they need more help . Our game instead will start players with a 5 second audio clip, giving them a more reasonable starting point to recognize the song. Players will then proceed to guess the song title, artist, or both, making the game less focused on recognizing a song from the smallest possible snippet. 

Bandle \- Players guess a song by revealing instruments one at a time, with each instrument providing another clue. Our game will play a 5 second clip of the actual song instead of separating the song into individual instruments. This makes recognizing the song itself the main challenge rather than identifying it based on its musical components. 

Songless \- Songless is the most similar to our game because our players listen to a short song snippet, make a guess, and receive more of the song if they guess incorrectly. Our game will follow a similar progression, starting with a 5 second clip and increasing the amount of the song the player can hear after incorrect guesses. Our version will just use the [Last.fm](http://Last.fm) API for its music data and will be designed around our own interface and quiz structure.

**Scaled feature plan**

| Milestone | Date | Requirements |
| :---: | :---: | ----- |
| 1 | Sept. 29th (Lab 03\) | Proposal, includes the topic, API that is being used, comparators to the to-be-created website, and the feature plan for the upcoming milestones. Static HTML \+ CSS. Prototype Project board, with issues added. |
| 2 | Oct. 20th (Lab 06\) | React \+ Vite Prototype. Should use mock data (a JSON file or array). Should make use of components, properties, states, event handling, and list rendering with keys. Branches merged through pull requests. Project board updates, confirming completion for Milestone 2 and anything that has been completed since. Live progress demo. |
| 3 | Nov. 17th (Lab 10\) | Complete application with 1. Using the API 2. Loading/error/cancel handling 3. Search/filter/sort 4. Routed detail views 5. Persistent user state 6. At least 1 form Tests 7. Deployed to a public URL. Final presentation and demo Documented AI use, if any. |
| 4 | Dec. XX (Exam) | Research a topic that was not taught in CSCI3230U individually. Implementations of topic in the application. Create short video explaining the concept from the research, then demo the implementation |

| Member | Role(s) | Plan |
| :---: | :---: | ----- |
| Sasha Dmitriev | Frontend & Project Management | Issue management and project board maintenance for all milestones HTML page design (M1, M2, M3) Creation of controlled form |
| Qudsia Fawad | Documentation & UI/UX | M1: HTML/CSS styling and UI design  M2: UI design and styling for React components M3: UI/UX testing, final styling, and documentation M4: Research and documentation of individual topic |
| Liam Evask | Back End | M1: quiz html, writeframe, comments M2: JS for game mechanics and api calls M3: Bug testing, making sure things work M4: Undecided |
| Omar Ahmed | Testing & Quality Assurance | M1:helping create play and hint button for static html and test the prototype M2: Test and help create different features such as the point deduction system as well as test the interactions with the UI M3: Test the API, how the quiz functions and fix any errors. Document any bugs before we deploy the project M4:Research a topic not taught in this course |
