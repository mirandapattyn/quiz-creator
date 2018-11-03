var QuizController = function (model, view) {
    this.model = model;
    this.view = view;

    this.init();
};

QuizController.prototype = {

    init: function () {
        this.setupHandlers()
            .enable();
    },

    setupHandlers: function () {
        this.storeQuizHandler = this.storeQuiz.bind(this);
        this.deleteQuizHandler = this.deleteQuiz.bind(this);
        return this;
    },

    enable: function () {
        this.view.storeQuizEvent.attach(this.storeQuizHandler);
        this.view.deleteQuizEvent.attach(this.deleteQuizHandler);
        return this;
    },

    storeQuiz: function (sender, args) {
        this.model.storeQuiz(args.title, args.questionDiv);
    },

    deleteQuiz: function (sender, args) {
        this.model.deleteQuiz(args.title);
    }
};