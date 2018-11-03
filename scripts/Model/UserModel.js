var UserModel = function() {
    this.submitQuizEvent = new Event(this);
    this.displayScoreEvent = new Event(this);
    this.questions = "";

    this.retrieveTitles = new Promise((resolve) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                this.titles = this.responseText;
                this.titles = JSON.parse(this.titles);

                resolve(this.titles);
                return this.titles;
            }
        };
        xhttp.open("POST", "/retrieve_titles", true);
        xhttp.send();
    });

    this.retrieveQuiz = new Promise((resolve) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                this.questions = this.responseText;
                this.questions = JSON.parse(this.questions);

                resolve(this.questions);
                return this.questions;
            }
        };
        xhttp.open("POST", "/retrieve_quiz", true);
        xhttp.send();
    });
};

UserModel.prototype = { 
    submitQuiz: function(answerList, questionDiv) {
        let answerKey = [];
        for (i = 0; i < this.questions.length; i++)
        {
            answerKey.push(this.questions[i].correct);
        }

        let correct = 0;

        for (i = 0; i < answerList.length; i++) {
            if (answerList[i] == answerKey[i]) {
                this.markCorrect(i, answerList[i], questionDiv);
                correct++;
            }
            else {
                this.markIncorrect(i, answerList[i], answerKey[i], questionDiv);
            }
        }
        this.submitQuizEvent.notify();
        this.displayScoreEvent.notify({
            score: correct
        });
    },

    markCorrect: function(qIndex, answer, div) {
        let questionList = div[0].childNodes;
        if (answer == 0) {
            questionList[qIndex].getElementsByClassName("answer0")[0].style.backgroundColor = "green";
        } else if (answer == 1) {
            questionList[qIndex].getElementsByClassName("answer1")[0].style.backgroundColor = "green";
        } else if (answer == 2) {
            questionList[qIndex].getElementsByClassName("answer2")[0].style.backgroundColor = "green";
        } else if (answer == 3) {
            questionList[qIndex].getElementsByClassName("answer3")[0].style.backgroundColor = "green";
        }
    },

    markIncorrect: function(qIndex, wrong, answer, div) {
        let questionList = div[0].childNodes;
        if (answer == 0) {
            questionList[qIndex].getElementsByClassName("answer0")[0].style.backgroundColor = "green";
        } else if (answer == 1) {
            questionList[qIndex].getElementsByClassName("answer1")[0].style.backgroundColor = "green";
        } else if (answer == 2) {
            questionList[qIndex].getElementsByClassName("answer2")[0].style.backgroundColor = "green";
        } else if (answer == 3) {
            questionList[qIndex].getElementsByClassName("answer3")[0].style.backgroundColor = "green";
        }

        if (wrong == 0) {
            questionList[qIndex].getElementsByClassName("answer0")[0].style.backgroundColor = "red";
        } else if (wrong == 1) {
            questionList[qIndex].getElementsByClassName("answer1")[0].style.backgroundColor = "red";
        } else if (wrong == 2) {
            questionList[qIndex].getElementsByClassName("answer2")[0].style.backgroundColor = "red";
        } else if (wrong == 3) {
            questionList[qIndex].getElementsByClassName("answer3")[0].style.backgroundColor = "red";
        }
    }
 };