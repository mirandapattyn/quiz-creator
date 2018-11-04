var ErrorMessage = function (key) {
    this._key = key;
    this.messages = {
        'answerAllQ': '<br>Answer all questions before submitting',
        'fillInAllSave': '<br>Fill in all fields before saving quiz',
        'fillInAllReg': '<br>Fill in all fields before registering',
        'fillInAllLog': '<br>Fill in all fields before logging in',
        'noQuizLoad': '<br>No quiz is selected to load',
        'noQuizDelete': '<br>No quiz is selected to delete',
        'sameUser': '<br>A user with this username already exists'
    };
}

ErrorMessage.prototype = {
    get: function() {
        error = document.createElement("SPAN");
        error.setAttribute("class", "error");
        error.innerHTML = this.messages[this._key];

        return error;
    }
};

