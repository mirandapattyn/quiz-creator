var UserView = function(model) {
    this.model = model;
    this.radio = 0;
    this.titles = [];
    this.users = [];
    this.both = [];
    this.submitQuizEvent = new Event(this);
    this.displayScoreEvent = new Event(this);

    this.init();
};

UserView.prototype = {
    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
    },

    createChildren: function () {
        this.$container = $('.container');
        this.$select = this.$container.find('.select');
        this.$question = this.$container.find('.question');
        this.$buttons = this.$container.find('.buttons');
        this.$score = this.$container.find('.score');
        this.$logout = this.$container.find('.logout');
        this.$scoreList = this.$container.find('.scoreList');

        this.checkLogin();
        this.getTitles();
        this.initButtons();
        this.initLogout();

        return this;
    },

    setupHandlers: function () {
        this.selectQuizHandler = this.selectQuiz.bind(this);
        this.submitQuizHandler = this.submitQuiz.bind(this);
        this.retryQuizHandler = this.selectQuiz.bind(this);
        this.logoutHandler = this.logout.bind(this);

        return this;
    },

    enable: function() {
        this.$selectButton.onclick = this.selectQuizHandler;
        this.$submitButton.onclick = this.submitQuizHandler;
        this.$retryButton.onclick = this.retryQuizHandler;
        this.$logoutButton.onclick = this.logoutHandler;

        return this;
    },

    getTitles: function() {
        this.$selectButton = document.createElement("BUTTON");
        this.$selectButton.setAttribute("class", "btn btn-primary");
        this.$selectButton.innerHTML = "Select Quiz";

        this.model.retrieveTitles.then((data) => {
            for (i = 0; i < data.length; i++) {
                this.titles.push(data[i].title);
                this.users.push(data[i].user);
            }

            this.$dropdown = document.createElement("SELECT");
            let selectOption = document.createElement("OPTION");
            selectOption.innerHTML = "Select";
            this.$dropdown.append(selectOption);

            for (i = 0; i < this.titles.length; i++) {
                let option = document.createElement("OPTION");
                option.setAttribute("value", this.titles[i]);
                option.innerHTML = this.titles[i];
                this.$dropdown.append(option);
            }

            this.$select.append(this.$dropdown);
            this.$select.append(this.$selectButton);
        });
    },

    initButtons: function() {
        this.$submitButton = document.createElement("BUTTON");
        this.$submitButton.setAttribute("class", "btn btn-primary");
        this.$submitButton.innerHTML = "Submit Quiz";

        this.$retryButton = document.createElement("BUTTON");
        this.$retryButton.setAttribute("class", "btn btn-primary");
        this.$retryButton.innerHTML = "Retry Quiz";

        this.$buttons.append(this.$submitButton);
        this.$buttons.append(this.$retryButton);

        $(this.$buttons).hide();
    },

    initLogout: function() {
        this.$logoutButton = document.createElement("BUTTON");
        this.$logoutButton.setAttribute("class", "btn btn-primary");
        this.$logoutButton.innerHTML = "Logout";

        this.$logout.append(this.$logoutButton);
    },

    selectQuiz: function() {
        $(this.$noQuizError).remove();
        if (this.$dropdown.selectedIndex == 0) {
            msg = new ErrorMessage("noQuizLoad");
            this.$noQuizError = msg.get();
            this.$select.append(this.$noQuizError);
        } else {
            $(this.$question).empty();
            this.initQuestions();
            $(this.$buttons).show();
            this.getScoreList();
        }
    },

    initQuestions: function() {
        let questions = "";
        this.$title = this.$dropdown.options[this.$dropdown.selectedIndex].value;
        this.$user = this.users[this.$dropdown.selectedIndex - 1];

        this.model.retrieveQuiz.then((data) => {
            this.model.questions = data;

            for (i = 0; i < data.length; i++) {
                if (data[i].title == this.$title && data[i].user == this.$user) {
                    questions = data[i].questions;
                    break;
                }
            }

            this.$answerKey = [];

            for (i = 0; i < questions.length; i++)
            {
                let d = document.createElement("DIV");
                let q = document.createElement("SPAN");

                q.innerHTML = questions[i].question;
                d.append(q);

                d.append(document.createElement("BR"));

                let difficulty = "";
                let diff = document.createElement("SPAN");
                if (questions[i].difficulty == 0)
                {
                    difficulty = "Easy";
                    diff.setAttribute("class", "easy");
                }
                else if (questions[i].difficulty == 1)
                {
                    difficulty = "Hard";
                    diff.setAttribute("class", "hard");
                }
                diff.innerHTML = difficulty;
                d.append(diff);
                d.append(document.createElement("BR"));

                let radio = document.createElement("INPUT");
                radio.setAttribute("type", "radio");
                radio.setAttribute("class", "radio0");
                radio.setAttribute("name", "group" + this.radio);
                let answer = document.createElement("SPAN");
                answer.setAttribute("class", "answer0");
                answer.innerHTML = questions[i].answer0;
                d.append(radio);
                d.append(answer);
                d.append(document.createElement("BR"));

                radio = document.createElement("INPUT");
                radio.setAttribute("type", "radio");
                radio.setAttribute("class", "radio1");
                radio.setAttribute("name", "group" + this.radio);
                answer = document.createElement("SPAN");
                answer.setAttribute("class", "answer1");
                answer.innerHTML = questions[i].answer1;
                d.append(radio);
                d.append(answer);
                d.append(document.createElement("BR"));

                radio = document.createElement("INPUT");
                radio.setAttribute("type", "radio");
                radio.setAttribute("class", "radio2");
                radio.setAttribute("name", "group" + this.radio);
                answer = document.createElement("SPAN");
                answer.setAttribute("class", "answer2");
                answer.innerHTML = questions[i].answer2;
                d.append(radio);
                d.append(answer);
                d.append(document.createElement("BR"));

                radio = document.createElement("INPUT");
                radio.setAttribute("type", "radio");
                radio.setAttribute("class", "radio3");
                radio.setAttribute("name", "group" + this.radio);
                answer = document.createElement("SPAN");
                answer.setAttribute("class", "answer3");
                answer.innerHTML = questions[i].answer3;
                d.append(radio);
                d.append(answer);
                d.append(document.createElement("BR"));
                d.append(document.createElement("BR"));

                this.$question.append(d);
                this.radio++;

                this.$answerKey.push(questions[i].correct);
            }
        });
    },

    addAnswerOption: function(div, index) {
        let radio = document.createElement("INPUT");
        radio.setAttribute("type", "radio");
        radio.setAttribute("class", "radio" + index);

        let answer = document.createElement("SPAN");
        answer.setAttribute("class", "answer" + index);

        div.append(radio);
        div.append(textInput);
        div.append(document.createElement("BR"));
    },

    getScoreList: function() {
        this.model.retrieveScores.then((data) => {
            let scoreListUsers = [];
            let scoreListScores = [];

            for (i = 0; i < data.length; i++) {
                if (data[i].quiz == this.$title && data[i].owner == this.$user) {
                    scoreListUsers.push(data[i].user);
                    scoreListScores.push(data[i].score);
                }
            }

            $(this.$scoreList).empty();
            for (i = 0; i < scoreListUsers.length; i++) {
                let entry = document.createElement("P");
                entry.setAttribute("class", scoreListScores[i]);
                entry.innerHTML = scoreListUsers[i] + ": " + scoreListScores[i];
                this.$scoreList.append(entry);
            }
        });
    },

    submitQuiz: function() {
        $(this.$answerQError).remove();
        let answers = [];

        for (i = 0; i < this.$question[0].childNodes.length; i++)
        {
            let answer = -1;

            if (this.$question[0].childNodes[i].getElementsByClassName("radio0")[0].checked == true) 
            {
                answer = 0;
            }
            else if (this.$question[0].childNodes[i].getElementsByClassName("radio1")[0].checked == true) 
            {
                answer = 1;
            }
            else if (this.$question[0].childNodes[i].getElementsByClassName("radio2")[0].checked == true) 
            {
                answer = 2;
            }
            else if (this.$question[0].childNodes[i].getElementsByClassName("radio3")[0].checked == true) 
            {
                answer = 3;
            }

            if (answer != -1) {
                answers.push(answer);
            }
        }

        if (answers.length != this.$question[0].childNodes.length) {
            msg = new ErrorMessage("answerAllQ");
            this.$answerQError = msg.get();
            this.$buttons.append(this.$answerQError);
            return;
        }

        this.submitQuizEvent.notify({
            title: this.$title,
            owner: this.$user,
            answerList: answers,
            answerKey: this.$answerKey,
            questionDiv: this.$question
        });

        this.getScoreList();
    },

    displayScore: function(score) {
        $(this.$score).empty();
        let scoreDisplay = document.createElement("P");
        scoreDisplay.innerHTML = score;

        this.$score.append(scoreDisplay);

        radios = document.getElementsByTagName("INPUT");
        for (i = 0; i < radios.length; i++) {
            radios[i].setAttribute("disabled", true);
        }
        this.displayScoreEvent.notify();
    },

    checkLogin: function () {
        if (sessionStorage.getItem("userType") != 2) {
            this.logout();
        }
    },

    logout: function() {
        sessionStorage.clear();
        window.location.href = '/';
    }
};
