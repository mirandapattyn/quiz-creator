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
        return this;
    },

    enable: function () {
        this.view.submitQuizEvent.attach(this.submitQuizHandler);
        return this;
    },

    submitQuiz: function (sender, args) {
        this.model.submitQuiz(args.answerList, args.questionDiv);
    }
};