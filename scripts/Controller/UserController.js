var UserController = function (model, view) {
    this.model = model;
    this.view = view;

    this.init();
};

UserController.prototype = {

    init: function () {
        this.setupHandlers()
            .enable();
    },

    setupHandlers: function () {
        this.submitQuizHandler = this.submitQuiz.bind(this);
        this.displayScoreHandler = this.displayScore.bind(this);
        return this;
    },

    enable: function () {
        this.view.submitQuizEvent.attach(this.submitQuizHandler);
        this.model.displayScoreEvent.attach(this.displayScoreHandler);
        return this;
    },

    submitQuiz: function (sender, args) {
        this.model.submitQuiz(args.title, args.owner, args.answerList, args.answerKey, args.questionDiv);
    },

    displayScore: function (sender, args) {
        this.view.displayScore(args.score);
    }
};