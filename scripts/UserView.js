var UserView = function(model) {
    this.model = model;
    this.radio = 0;
    this.submitQuizEvent = new Event(this);

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
        this.$question = this.$container.find('.question');
        this.$submit = this.$container.find('.submit');
        
        this.initQuestions();
        this.initSubmit();

        return this;
    },

    setupHandlers: function () {
        this.submitQuizHandler = this.submitQuiz.bind(this);

        return this;
    },

    enable: function() {
        this.$submitButton.onclick = this.submitQuizHandler;

        return this;
    },

    initQuestions: function() {
        let questions = ""
        this.model.retrieveQuiz.then((data) => {
            this.model.questions = data;
            questions = data;

            console.log(questions);

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
            }
        })
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

    initSubmit: function() {
        this.$submitButton = document.createElement("BUTTON");
        this.$submitButton.setAttribute("class", "btn btn-primary");
        this.$submitButton.innerHTML = "Submit Quiz";

        this.$submit.append(this.$submitButton);
    },

    submitQuiz: function() {
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

            answers.push(answer);
        }

        this.submitQuizEvent.notify({
            answerList: answers,
            questionDiv: this.$question
        });
    }
};
