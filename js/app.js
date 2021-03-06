var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider,) {
    $routeProvider
        .when("/", {
            templateUrl: "trangchu.html",
        })
        .when("/gioithieu", {
            templateUrl: "Gioithieu.html",
        })
        .when("/lienhe", {
            templateUrl: "Lienhe.html",
        })
        .when("/gopy", {
            templateUrl: "Gopy.html",
        })
        .when("/hoidap", {
            templateUrl: "Hoidap.html",
        })
        .when("/capnhattaikhoan", {
            templateUrl: "Capnhattaikhoan.html",
        })
        .when("/danhmucmonhoc", {
            templateUrl: "danhmucmonhoc.html",
        })
        .when("/dangnhap", {
            templateUrl: "Dangnhap.html",
        })
        .when("/subjects", {
            templateUrl: "subjects.html",
        })
        .when("/quiz/:id/:name", {
            templateUrl: "quiz-app.html",
        })
        .when("/qlQuiz",{
            templateUrl: "QLQuiz.html",
        })
        .when("/dangky",{
            templateUrl: "DangKy.html",
        })
});

app.controller('subjectCtrl', function ($scope, $http) {
    $scope.list_subject = [];
    $http.get('../ASM/db/Subjects.js').then(function (reponse) {
        $scope.list_subject = reponse.data;
    })
});

app.directive('quizfpoly', function (quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template_quiz.html',
        link: function (scope, elem, attrs) {
            scope.start = function () {
                scope.id = 1;
                scope.quizOver = false;
                scope.inProgess = true;
                scope.getQuestion();
            };
            scope.reset = function () {
                scope.inProgess = false;
                scope.score = 0;
            };
            scope.getQuestion = function () {
                var quiz = quizFactory.getQuestion(scope.id);
                if (quiz) {
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            }
            scope.checkAnswer = function () {
                //alert('answer');
                if (!$('input[name = answer]:checked').length) return;
                var ans = $('input[name = answer]:checked').val();
                if (ans == scope.answer) {
                    //alert('dung');
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    //alert('sai');
                    scope.correctAns = false;
                }
                scope.answerMode = false;
            };
            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            }
            scope.reset();
        }

    }
});
app.factory('quizFactory', function ($http, $routeParams) { // t???o ra d???ch v??? c?? ch???c n??ng t??y bi???n 
    $http.get('../ASM/db/Quizs/' + $routeParams.id + '.js').then(function (reponse) { //$routeParams l???y d??? li???u t???i :id ../ASM/db/Quizs/
        questions = reponse.data;
        //alert(questions, length);
    });
    return {
        getQuestion: function (id) {
            var count = questions.length;
            var randomItem = questions[Math.floor(Math.random() * questions.length)];
            if (count > 10) {
                count = 10;
            }

            if (id < count) {
                return randomItem;
            } else {
                return false;
            }

        }
    }
});

app.controller('studentCtrl', function ($scope, $http) {
    $scope.isLoading = false;
    $scope.isSuccess = false;
    $scope.message = "";
    $scope.list_students = [];
    $scope.student = {
        username: "",
        password: "",
        fullname: "",
        email: "",
        gender: true,
        birthday: "",
        schoolfee: "",
        marks: "",
        id: ""
    };
    const url = 'https://620d3fa9b573632593ac1a79.mockapi.io/taiKhoan';
    $scope.isLoading = true;
    $http.get(url).then(function (reponse) {
        $scope.list_students = reponse.data;
        $scope.isLoading = false;
    })
        .catch(function (error) {
            console.log(error);
            $scope.isLoading = false;
        });
    $scope.onSubmitForm = function (event) {
        //event.preventDefault();
        $scope.isLoading = true;
        // G???i request d???ng POST k??m data l??n API
        $http.post(url, $scope.student)
            .then(function (response) {
                // T???t loading
                $scope.isLoading = false;

                // Th??ng b??o
                $scope.message = "Th??m m???i th??nh c??ng";
                $scope.isSuccess = true;

                // Th??m v??o b???ng
                $scope.list_students.push(response.data);
            })
            .catch(function (error) {
                console.log(error);
                $scope.isLoading = false;
                $scope.message = "Th??m m???i th???t b???i";
                $scope.isSuccess = false;
            });
    }

    $scope.update = function () {
        const id = $scope.student.id; //l???y id student
        const apiUpdate = url + "/" + id;
        console.log(id); 
        console.log(apiUpdate);  

        // G???i API v???i method PUT
        $http.put(apiUpdate, $scope.student)
            .then(function (response) { 
                // T???t loading
                $scope.isLoading = false;

                // Th??ng b??o
                $scope.message = "S???a th??nh c??ng";
                $scope.isSuccess = true;
            })
    }

    $scope.onDelete = function (index) {
        const id = $scope.list_students[index].id;
        const apiDelete = url + "/" + id;

        // G???i API v???i method DELETE
        $http.delete(apiDelete)
            .then(function (response) {
                // X??a tr??n table
                $scope.list_students.splice(index, 1);// splice ????? x??a t???i index /x??a 1 ph???n t???
                location.reload();
            })
    }
    $scope.edit = function (index) {
        $scope.index = index;
        $scope.student = $scope.list_students[index];
    }

    $scope.login = function () {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        if (username == "teonv" && password == "iloveyou") {
            alert("Login successfully");
            window.location = "index.html";
            return false;
        }
        else {
            alert("Th???t b???i");
        }
    }
});

