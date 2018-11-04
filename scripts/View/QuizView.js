var QuizView = function (model) {
    this.model = model;
    this.radio = 0;
    this.storeQuizEvent = new Event(this);
    this.deleteQuizEvent = new Event(this);

    this.init();
};      

QuizView.prototype = {
    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
    },

    createChildren: function () {
        this.$container = $('.container-fluid');
        this.$select = this.$container.find('.select');
        this.$title = this.$container.find('.title');
        this.$question = this.$container.find('.questions');
        this.$buttons = this.$container.find('.buttons');
        this.$logout = this.$container.find('.logout');

        this.checkLogin();
        this.getTitles();
        this.initTitle();
        this.addQuestion("");
        this.initAdd();
        this.initSave();
        this.initLogout();

        return this;
    },

    setupHandlers: function () {
        this.selectQuizHandler = this.selectQuiz.bind(this);
        this.addQuestionHandler = this.addQuestion.bind(this, "");
        this.deleteQuestionHandler = this.deleteQuestion.bind(this);
        this.storeQuizHandler = this.storeQuiz.bind(this);
        this.deleteQuizHandler = this.deleteQuiz.bind(this);
        this.logoutHandler = this.logout.bind(this);

        return this;
    },

    enable: function () {
        this.$selectButton.onclick = this.selectQuizHandler;
        this.$addButton.onclick = this.addQuestionHandler;
        this.$deleteButton.onclick = this.deleteQuestionHandler;
        this.$saveButton.onclick = this.storeQuizHandler;
        this.$deleteQuizButton.onclick = this.deleteQuizHandler;
        this.$logoutButton.onclick = this.logoutHandler;

        return this;
    },

    getTitles: function() {
        this.$selectButton = document.createElement("BUTTON");
        this.$selectButton.setAttribute("class", "btn btn-primary");
        this.$selectButton.innerHTML = "Select Quiz";

        this.model.retrieveTitles.then((data) => {
            this.$dropdown = document.createElement("SELECT");
            this.$dropdown.setAttribute("class", "dropdown");
            let selectOption = document.createElement("OPTION");
            selectOption.innerHTML = "New Quiz";
            this.$dropdown.append(selectOption);

            for (i = 0; i < data.length; i++) {
                if (data[i].user == sessionStorage.getItem("userID"))
                {
                    let option = document.createElement("OPTION");
                    option.setAttribute("value", data[i].title);
                    option.innerHTML = data[i].title;
                    this.$dropdown.append(option);
                }
            }

            this.$select.append(this.$dropdown);
            this.$select.append(this.$selectButton);
        });
    },

    initTitle: function() {
        let label = document.createElement("SPAN");
        label.setAttribute("class", "label");
        label.innerHTML = "Quiz Title:&nbsp;"
        this.$titleText = document.createElement("INPUT");
        this.$titleText.setAttribute("type", "text");
        this.$titleText.setAttribute("size", "35");

        this.$title.append(label);
        this.$title.append(this.$titleText);
    },

    addQuestion: function(item) {
        let d = document.createElement("DIV");
        let label = document.createElement("SPAN");
        label.setAttribute("class", "label");
        label.innerHTML = "Question:&nbsp;"
        let q = document.createElement("TEXTAREA");
        q.setAttribute("type", "text");
        q.setAttribute("class", "field questionText");
        q.setAttribute("rows", "2");
        q.setAttribute("cols", "35");

        if (item != "") {
            q.innerHTML = item.question;
        }

        d.append(label);
        d.append(q);
        d.append(document.createElement("BR"));

        if (item == "") {
            for (i = 0; i < 4; i++) {
                this.addAnswerOption(d, i, "", -1);
            }
        } else {
            this.addAnswerOption(d, 0, item.answer0, item.correct);
            this.addAnswerOption(d, 1, item.answer1, item.correct);
            this.addAnswerOption(d, 2, item.answer2, item.correct);
            this.addAnswerOption(d, 3, item.answer3, item.correct);
        }

        d.append(document.createElement("BR"));

        if (item == "")
        {
            this.addDifficulty(d, -1);
        } else {
            this.addDifficulty(d, item.difficulty);
        }

        d.append(document.createElement("BR"));

        this.initDeleteButton(d);

        this.radio++;

        this.$question.append(d);
    },

    addAnswerOption: function(div, index, value, correct) {
        let letter = "0";
        switch (index) {
            case (0): letter = "a)";
            break;
            case (1): letter = "b)";
            break;
            case (2): letter = "c)";
            break;
            case (3): letter = "d)";
            break;
            default: letter = "ERROR";
        }

        let label = document.createElement("SPAN");
        label.setAttribute("class", "label letter");
        label.innerHTML = letter + "&nbsp;";

        let radio = document.createElement("INPUT");
        radio.setAttribute("type", "radio");
        radio.setAttribute("class", "radio" + index);
        radio.setAttribute("name", "group" + this.radio);

        if (correct == index) {
            radio.checked = true;
        }

        let textInput = document.createElement("INPUT");
        textInput.setAttribute("type", "text");
        textInput.setAttribute("class", "field answer" + index);
        textInput.setAttribute("value", value);
        textInput.setAttribute("size", "30");

        div.append(label);
        div.append(radio);
        div.append(textInput);
        div.append(document.createElement("BR"));
    },

    addDifficulty: function(div, selected) {
        let text = document.createElement("SPAN");
        text.setAttribute("class", "label");
        let radio = document.createElement("INPUT");
        let easy = document.createElement("SPAN");
        let radio2 = document.createElement("INPUT");
        let hard = document.createElement("SPAN");

        text.innerHTML = "Difficulty:&nbsp;&nbsp;";
        easy.innerHTML = "&nbsp;Easy&nbsp;&nbsp;";
        hard.innerHTML = "&nbsp;Hard";

        radio.setAttribute("type", "radio");
        radio2.setAttribute("type", "radio");
        radio.setAttribute("name", "difficulty" + this.radio);
        radio2.setAttribute("name", "difficulty" + this.radio);
        radio.setAttribute("class", "easy");
        radio2.setAttribute("class", "hard");

        if (selected == 0) {
            radio.checked = true;
        } else if (selected == 1) {
            radio2.checked = true;
        }

        div.append(text);
        div.append(radio);
        div.append(easy);
        div.append(radio2);
        div.append(hard);
    },

    initDeleteButton: function(div) {
        this.$deleteButton = document.createElement("BUTTON");
        this.$deleteButton.setAttribute("class", "btn btn-primary");
        this.$deleteButton.innerHTML = "Delete Question";
        this.$deleteButton.onclick = this.deleteQuestionHandler;

        div.append(this.$deleteButton);
        div.append(document.createElement("BR"));
    },

    initAdd: function() {
        this.$addButton = document.createElement("BUTTON");
        this.$addButton.setAttribute("class", "btn btn-primary");
        this.$addButton.setAttribute("id", "addBTN");
        this.$addButton.innerHTML = "Add Question";

        this.$buttons.append(this.$addButton);
    },

    initSave: function() {
        this.$saveButton = document.createElement("BUTTON");
        this.$saveButton.setAttribute("class", "btn btn-primary");
        this.$saveButton.innerHTML = "Save Quiz";

        this.$deleteQuizButton = document.createElement("BUTTON");
        this.$deleteQuizButton.setAttribute("class", "btn btn-primary");
        this.$deleteQuizButton.innerHTML = "Delete Quiz";

        this.$buttons.append(this.$saveButton);
        this.$buttons.append(this.$deleteQuizButton);
    },

    initLogout: function() {
        this.$logoutButton = document.createElement("BUTTON");
        this.$logoutButton.setAttribute("class", "btn btn-warning btn-sm");
        this.$logoutButton.innerHTML = "Logout";
        this.$logoutButton.setAttribute("id", "logout");

        this.$logout.append(this.$logoutButton);
    },

    selectQuiz: function() {
        $(this.$noQuizError).remove();
        $(this.$fillInError).remove();
        $(this.$question).empty();
        this.getQuestions();
    },

    getQuestions: function() {
        if (this.$dropdown.selectedIndex == 0) {
            this.$titleText.setAttribute("value", "");
            this.addQuestion("");
            return;
        }
        let questions = "";
        this.model.retrieveQuiz.then((data) => {
            this.model.questions = data;

            let title = this.$dropdown.options[this.$dropdown.selectedIndex].value;
            this.$titleText.setAttribute("value", title);

            for (i = 0; i < data.length; i++) {
                if (data[i].title == title) {
                    questions = data[i].questions;
                    break;
                }
            }

            for (i = 0; i < questions.length; i++) {
                this.addQuestion(questions[i]);
            }
        });
    },

    deleteQuestion: function(sender) {
        element = sender.path[1];
        element.parentNode.removeChild(element);
    },

    storeQuiz: function () {
        $(this.$fillInError).remove();
        let qList = this.$question[0].childNodes;
        let store = true;

        let fields = document.getElementsByTagName("INPUT");
        let quests = document.getElementsByTagName("TEXTAREA");
        let rCount = 0;

        for (i = 0; i < fields.length; i++) {
            if (fields[i].value == "") {
                store = false;
            } else if (fields[i].checked == true) {
                rCount++;
            }
        }

        for (i = 0; i < quests.length; i++) {
            if (quests[i].value == "") {
                store = false;
            }
        }

        if (rCount != qList.length * 2) {
            store = false;
        }

        if (!store) {
            msg = new ErrorMessage("fillInAllSave");
            this.$fillInError = msg.get();
            this.$buttons.append(this.$fillInError);
        } else {
            this.storeQuizEvent.notify({
                title: this.$titleText.value,
                questionDiv: this.$question
            });
        }
    },

    deleteQuiz: function () {
        $(this.$noQuizError).remove();
        if (this.$dropdown.selectedIndex == 0) {
            msg = new ErrorMessage("noQuizDelete");
            this.$noQuizError = msg.get();
            this.$buttons.append(this.$noQuizError);
        } else {
            this.deleteQuizEvent.notify({
                title: this.$titleText.value
            });
            location.reload();
        }
    }, 

    checkLogin: function () {
        if (sessionStorage.getItem("userType") != 1) {
            this.logout();
        }
    },

    logout: function() {
        sessionStorage.clear();
        window.location.href = '/';
    }
};
