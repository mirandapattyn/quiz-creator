var LoginModel = function (collection) {
    this.collection = collection;
    this.registerEvent = new Event(this);
    this.loginEvent = new Event(this);
    this.errorEvent = new Event(this);

    if (sessionStorage.getItem("userType") == 1) {
        window.location.href = '/admin';
    } else if (sessionStorage.getItem("userType") == 2) {
        window.location.href = '/user';
    } 
};

LoginModel.prototype = {

    register: function (usertype, name, username, password) {
        let registerJSON = "{\"type\": \"" 
            + usertype + "\", \"name\": \""
            + name + "\", \"_id\": \""
            + username + "\", \"password\": \""
            + password + "\"}";

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText) {
                    this.sendError();
                } else {
                    var xhttp = new XMLHttpRequest();
                    xhttp.open("POST", "/store_user", true);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send("data=" + registerJSON);

                    location.reload();
                    this.registerEvent.notify();
                    return;
                }
            }
        };
        xhttp.open("POST", "/check_username", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("data=" + registerJSON);

        this.registerEvent.notify();
    },

    sendError() {
        this.errorEvent.notify({
            msg: new ErrorMessage("sameUser")
        });
    },

    login: function (usertype, username, password) {
        let loginJSON = "{\"type\": \"" 
            + usertype + "\", \"_id\": \""
            + username + "\", \"password\": \""
            + password + "\"}";

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText) {
                        let response = JSON.parse(this.responseText);
                        sessionStorage.setItem("userID", response._id);
                        sessionStorage.setItem("userType", response.type);
                        if (response.type == 1) {
                            window.location.href = '/admin';
                        } else {
                            window.location.href = '/user';
                        } 
                    } else {
                        location.reload();
                    }
                }
            };
            xhttp.open("POST", "/check_login", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("data=" + loginJSON);

        this.loginEvent.notify();
    }
};