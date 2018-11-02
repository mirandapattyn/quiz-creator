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
        this.$title = this.$container.find('.title');
        this.$question = this.$container.find('.question');
        this.$add = this.$container.find('.add');
        this.$save = this.$container.find('.save');

        this.initTitle();
        this.initQuestion();
        this.initAdd();
        this.initSave();

        return this;
    },

    setupHandlers: function () {
        this.addQuestionHandler = this.initQuestion.bind(this);
        this.deleteQuestionHandler = this.deleteQuestion.bind(this);
        this.storeQuizHandler = this.storeQuiz.bind(this);

        return this;
    },

    enable: function () {
        this.$addButton.onclick = this.addQuestionHandler;
        this.$deleteButton.onclick = this.deleteQuestionHandler;
        this.$saveButton.onclick = this.storeQuizHandler;

        return this;
    },

    initTitle: function() {
        this.$titleText = document.createElement("INPUT");
        this.$titleText.setAttribute("type", "text");
        this.$titleText.setAttribute("placeholder", "Title");
        this.$titleText.setAttribute("size", "30");

        this.$title.append(this.$titleText);
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

        this.initDeleteButton(d);

        this.radio++;
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

        this.$add.append(this.$addButton);
    },

    initSave: function() {
        this.$saveButton = document.createElement("BUTTON");
        this.$saveButton.setAttribute("class", "btn btn-primary");
        this.$saveButton.setAttribute("id", "saveBTN");
        this.$saveButton.innerHTML = "Save Quiz";

        this.$save.append(this.$saveButton);
    },

    deleteQuestion: function(sender) {
        element = sender.path[1];
        element.parentNode.removeChild(element);
    },

    storeQuiz: function () {
        this.storeQuizEvent.notify({
            title: this.$titleText.value,
            questionDiv: this.$question
        });
    }
};
