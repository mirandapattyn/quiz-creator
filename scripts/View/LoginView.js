var LoginView = function (model) {
    this.model = model;
    this.registerEvent = new Event(this);
    this.loginEvent = new Event(this);
    this.errorEvent = new Event(this);

    this.init();
};      

LoginView.prototype = {
    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
    },

    createChildren: function () {
        this.$container = $('.container-fluid');
        this.$register = this.$container.find('.register');
        this.$login = this.$container.find('.login');

        this.initRegister();
        this.initLogin();

        return this;
    },

    setupHandlers: function () {
        this.registerHandler = this.register.bind(this);
        this.loginHandler = this.login.bind(this);
        return this;
    },

    enable: function () {
        this.$registerButton.onclick = this.registerHandler;
        this.$loginButton.onclick = this.loginHandler;
        return this;
    },

    initRegister: function() {
        this.initFields(0);
        this.initRegisterButton();
    },

    initLogin: function() {
        this.initFields(1);
        this.initLoginButton();
    },

    initUserType: function(type) {
        let text = document.createElement("SPAN");
        let adminRadio = document.createElement("INPUT");
        let admin = document.createElement("SPAN");
        let userRadio = document.createElement("INPUT");
        let user = document.createElement("SPAN");

        text.innerHTML = "User Type:&nbsp;&nbsp;";
        admin.innerHTML = "&nbsp;Admin&nbsp;";
        user.innerHTML = "&nbsp;User";

        adminRadio.setAttribute("type", "radio");
        userRadio.setAttribute("type", "radio");
        adminRadio.setAttribute("name", "usertype" + type);
        userRadio.setAttribute("name", "usertype" + type);
        adminRadio.setAttribute("class", "admin");
        userRadio.setAttribute("class", "user");

        let div = this.$register;

        if (type == 1) {
            div = this.$login;
            this.$loginRadio = [adminRadio, userRadio];
        } else {
            this.$registerRadio = [adminRadio, userRadio];
        }

        div.append(text);
        div.append(adminRadio);
        div.append(admin);
        div.append(userRadio);
        div.append(user);
        div.append(document.createElement("BR"));
    },

    initFields: function(type) {
        let div = this.$login;
        let header = document.createElement("P");
        header.setAttribute("class", "loginHeader");
        header.innerHTML = "Login";

        if (type == 0) {
            div = this.$register;
            header.innerHTML = "Register";
            this.$name = document.createElement("INPUT");
            this.$name.setAttribute("type", "text");
            this.$name.setAttribute("placeholder", "Name (Optional)");
            this.$name.setAttribute("size", "30");
            this.$name.setAttribute("class", "field");
            div.append(header);
            this.initUserType(0);
        } else {
            div.append(header);
            this.initUserType(1);
        }

        let username = document.createElement("INPUT");
        username.setAttribute("type", "text");
        username.setAttribute("placeholder", "Username");
        username.setAttribute("size", "30");
        username.setAttribute("class", "field");

        let password = document.createElement("INPUT");
        password.setAttribute("type", "password");
        password.setAttribute("placeholder", "Password");
        password.setAttribute("size", "30");
        password.setAttribute("class", "field");

        if (type == 0) {
            div.append(this.$name);
            div.append(document.createElement("BR"));
            this.$registerUN = username;
            this.$registerPW = password;
        } else {
            this.$loginUN = username;
            this.$loginPW = password;
        }

        div.append(username);
        div.append(document.createElement("BR"));
        div.append(password);
        div.append(document.createElement("BR"));
        div.append(document.createElement("BR"));
    },

    initRegisterButton: function() {
        this.$registerButton = document.createElement("BUTTON");
        this.$registerButton.setAttribute("class", "btn btn-primary");
        this.$registerButton.innerHTML = "Register";
        this.$registerButton.onclick = this.registerHandler;

        this.$register.append(this.$registerButton);
    },

    initLoginButton: function() {
        this.$loginButton = document.createElement("BUTTON");
        this.$loginButton.setAttribute("class", "btn btn-primary");
        this.$loginButton.innerHTML = "Log In";
        this.$loginButton.onclick = this.loginHandler;

        this.$login.append(this.$loginButton);
    },

    register: function() {
        $(this.$regError).remove();
        $(this.$usernameError).remove();
        let type = 0;
        if (this.$registerRadio[0].checked == true) {
            type = 1;
        }
        else if (this.$registerRadio[1].checked == true) {
            type = 2;
        }

        if (type != 0 && this.$registerUN.value != "" && this.$registerPW.value != "" && this.$name != "") {
            this.registerEvent.notify({
                usertype: type,
                name: this.$name.value,
                username: this.$registerUN.value,
                password: this.$registerPW.value
            });
        } else {
            msg = new ErrorMessage("fillInAllReg");
            this.$regError = msg.get();
            this.$register.append(this.$regError);
        }
    },

    login: function () {
        $(this.$loginError).remove();
        let type = 0;
        if (this.$loginRadio[0].checked == true) {
            type = 1;
        }
        else if (this.$loginRadio[1].checked == true) {
            type = 2;
        }

        if (type != 0 && this.$loginUN.value != "" && this.$loginPW.value != "") {
            this.loginEvent.notify({
                usertype: type,
                username: this.$loginUN.value,
                password: this.$loginPW.value
            });
        } else {
            msg = new ErrorMessage("fillInAllLog");
            this.$loginError = msg.get();
            this.$login.append(this.$loginError);
        }
    },

    usernameError(msg) {
        $(this.$regError).remove();
        $(this.$usernameError).remove();
        this.$usernameError = msg.get();
        this.$register.append(this.$usernameError);
    }
};
