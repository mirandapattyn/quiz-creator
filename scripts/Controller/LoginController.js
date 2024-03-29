var LoginController = function (model, view) {
    this.model = model;
    this.view = view;

    this.init();
};

LoginController.prototype = {

    init: function () {
        this.setupHandlers()
            .enable();
    },

    setupHandlers: function () {
        this.registerHandler = this.register.bind(this);
        this.loginHandler = this.login.bind(this);
        this.errorHandler = this.usernameError.bind(this);
        return this;
    },

    enable: function () {
        this.view.registerEvent.attach(this.registerHandler);
        this.view.loginEvent.attach(this.loginHandler);
        this.model.errorEvent.attach(this.errorHandler);
        return this;
    },

    register: function (sender, args) {
        this.model.register(args.usertype, args.name, args.username, args.password);
    },

    login: function (sender, args) {
        this.model.login(args.usertype, args.username, args.password);
    },

    usernameError: function (send, args) {
        this.view.usernameError(args.msg);
    }
};