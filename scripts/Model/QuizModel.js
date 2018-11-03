var QuizModel = function (collection) {
    this.collection = collection;
    this.storeQuizEvent = new Event(this);
    this.deleteQuizEvent = new Event(this);
    this.titleErrorEvent = new Event(this);

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

QuizModel.prototype = {

    storeQuiz: function (title, questionDiv) {
        this.questions = [];
        let questionList = questionDiv[0].childNodes;
        let questionJSON = "{\"title\": \""
            + title + "\", \"user\": \""
            + sessionStorage.getItem("userID") + "\", \"questions\": [";

        for(i = 0; i < questionList.length; i++) {
            let q = questionList[i].getElementsByClassName("questionText")[0].value;
            let a0 = questionList[i].getElementsByClassName("answer0")[0].value;
            let a1 = questionList[i].getElementsByClassName("answer1")[0].value;
            let a2 = questionList[i].getElementsByClassName("answer2")[0].value;
            let a3 = questionList[i].getElementsByClassName("answer3")[0].value;

            let correct = this.getCorrect(questionList[i]);
            let difficulty = this.getDifficulty(questionList[i]);
           
            this.questions[i] = "{\"question\": \"" 
                + q + "\", \"answer0\": \""
                + a0 + "\", \"answer1\": \"" 
                + a1 + "\", \"answer2\": \""
                + a2 + "\", \"answer3\": \""
                + a3 + "\", \"correct\": \""
                + correct + "\", \"difficulty\": \""
                + difficulty + "\"}";

            questionJSON += this.questions[i];    
            
            if (i != questionList.length - 1) {
                questionJSON += ", ";
            }
        }

        questionJSON += "]}";

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/store_quiz", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("data=" + questionJSON);

        location.reload();

        this.storeQuizEvent.notify();
    },

    getCorrect: function(qList) {
        if (qList.getElementsByClassName("radio0")[0].checked == true) {
            return 0;
        }
        else if (qList.getElementsByClassName("radio1")[0].checked == true) {
            return 1;
        }
        else if (qList.getElementsByClassName("radio2")[0].checked == true) {
            return 2;
        }
        else if (qList.getElementsByClassName("radio3")[0].checked == true) {
            return 3;
        } else {
            return -1;
        }
    },

    getDifficulty: function(qList) {
        if (qList.getElementsByClassName("easy")[0].checked == true) {
            return 0;
        } 
        else if (qList.getElementsByClassName("hard")[0].checked == true) {
            return 1;
        } else {
            return -1;
        }
    },

    deleteQuiz: function(title, user) {
        let titleJSON = "{\"title\": \"" 
            + title + "\", \"user\": \"" 
            + sessionStorage.getItem("userID") + "\"}";

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/delete_quiz", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("data=" + titleJSON);
    }
};