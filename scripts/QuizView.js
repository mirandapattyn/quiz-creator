var QuizView = function (model) {
    this.model = model;
    this.radio = 0;
    this.storeQuizEvent = new Event(this);

    this.init();
};      

QuizView.prototype = {
    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
    },

    createChildren: function () {
        this.$container = $('.container');
        this.$question = this.$container.find('.question');
        this.$save = this.$container.find('.save');

        this.initQuestion();
        this.initSave();

        return this;
    },

    setupHandlers: function () {
        this.addQuestionHandler = this.addQuestion.bind(this);
        this.deleteQuestionHandler = this.deleteQuestion.bind(this);
        this.storeQuizHandler = this.storeQuiz.bind(this);

        return this;
    },

    enable: function () {
        this.$addButton.onclick = this.addQuestionHandler;
        this.$saveButton.onclick = this.storeQuizHandler;

        return this;
    },

    initQuestion: function() {
        let d = document.createElement("DIV");
        let q = document.createElement("TEXTAREA");
        q.setAttribute("type", "text");
        q.setAttribute("class", "questionText");
        q.setAttribute("placeholder", "Question");
        q.setAttribute("rows", "2");
        q.setAttribute("cols", "40");
        d.append(q);
        d.append(document.createElement("BR"))

        this.addAnswerOption(d, 0);
        this.addAnswerOption(d, 1);
        this.addAnswerOption(d, 2);
        this.addAnswerOption(d, 3);

        d.append(document.createElement("BR"))

        this.addDifficulty(d);

        d.append(document.createElement("BR"))

        this.radio++;

        this.initAddButton(d);
        d.append(document.createElement("BR"))
        this.$question.append(d);
    },

    addAnswerOption: function(div, index) {
        let radio = document.createElement("INPUT");
        radio.setAttribute("type", "radio");
        radio.setAttribute("class", "radio" + index);
        radio.setAttribute("name", "group" + this.radio);

        let textInput = document.createElement("INPUT");
        textInput.setAttribute("type", "text");
        textInput.setAttribute("class", "answer" + index);
        textInput.setAttribute("placeholder", "Answer");
        textInput.setAttribute("size", "30");

        div.append(radio);
        div.append(textInput);
        div.append(document.createElement("BR"));
    },

    addDifficulty: function(div) {
        let text = document.createElement("SPAN");
        let radio = document.createElement("INPUT");
        let easy = document.createElement("SPAN");
        let radio2 = document.createElement("INPUT");
        let hard = document.createElement("SPAN");

        text.innerHTML = "Difficulty: ";
        easy.innerHTML = "Easy";
        hard.innerHTML = "Hard";

        radio.setAttribute("type", "radio");
        radio2.setAttribute("type", "radio");
        radio.setAttribute("name", "difficulty" + this.radio);
        radio2.setAttribute("name", "difficulty" + this.radio);
        radio.setAttribute("class", "easy");
        radio2.setAttribute("class", "hard");

        div.append(text);
        div.append(radio);
        div.append(easy);
        div.append(radio2);
        div.append(hard);
        div.append(document.createElement("BR"));
    },

    initAddButton: function(div) {
        this.$addButton = document.createElement("BUTTON");
        this.$addButton.setAttribute("class", "btn btn-primary");
        this.$addButton.innerHTML = "Add Question";

        div.append(this.$addButton);
        div.append(document.createElement("BR"));
    },

    initSave: function() {
        this.$saveButton = document.createElement("BUTTON");
        this.$saveButton.setAttribute("class", "btn btn-primary");
        this.$saveButton.setAttribute("id", "saveBTN");
        this.$saveButton.innerHTML = "Save Quiz";

        this.$save.append(this.$saveButton);
    },

    addQuestion: function() {
        this.initDeleteButton();
        this.initQuestion();
        this.$addButton.onclick = this.addQuestionHandler;
    },

    initDeleteButton: function() {
        this.$addButton.setAttribute("class", "btn btn-primary");
        this.$addButton.innerHTML = "Delete Question";
        this.$addButton.onclick = this.deleteQuestionHandler;
    },

    deleteQuestion: function(sender) {
        element = sender.path[1];
        element.parentNode.removeChild(element);
    },

    storeQuiz: function () {
        this.storeQuizEvent.notify({
            questionDiv: this.$question
        });
    },
};
