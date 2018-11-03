var ErrorMessage = function (key) {
    this._key = key;
    this.messages = {
        'answerAllQ': 'Answer all questions before submitting',
        'fillInAllSave': 'Fill in all fields before saving quiz',
        'fillInAllReg': 'Fill in all fields before registering',
        'fillInAllLog': 'Fill in all fields before logging in',
        'noQuizLoad': 'No quiz is selected to load',
        'noQuizDelete': 'No quiz is selected to delete'
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

