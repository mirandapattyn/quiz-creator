$(function () {
    var model = new LoginModel(),
        view = new LoginView(model),
        controller = new LoginController(model, view);
});