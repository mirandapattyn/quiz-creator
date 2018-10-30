 $(function () {
     var model = new QuizModel(),
         view = new QuizView(model),
         controller = new QuizController(model, view);
 });