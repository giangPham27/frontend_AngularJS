app.controller('quizCtrls', function ($scope, $http) {
    $scope.isLoading = false;
    $scope.isSuccess = false;
    $scope.message = "";
    $scope.list_quiz = [];
    $scope.quiz = {
            id: "",
            text: "", 
            da1:"", 
            da2:"", 
            da3:"",  
            da4:"", 
            da:""
    };
    const url = 'https://620d3fa9b573632593ac1a79.mockapi.io/quiz';
    $scope.isLoading = true;
    $http.get(url).then(function (reponse) {
        $scope.list_quiz = reponse.data;
        $scope.isLoading = false;
    })
        .catch(function (error) {
            console.log(error);
            $scope.isLoading = false;
        });
    $scope.Them = function (event) {
        //event.preventDefault();
        $scope.isLoading = true;
        // Gửi request dạng POST kèm data lên API
        $http.post(url, $scope.quiz)
            .then(function (response) {
                // Tắt loading
                $scope.isLoading = false;

                // Thông báo
                $scope.message = "Thêm mới thành công";
                $scope.isSuccess = true;

                // Thêm vào bảng
                $scope.list_quiz.push(response.data);
            })
            .catch(function (error) {
                console.log(error);
                $scope.isLoading = false;
                $scope.message = "Thêm mới thất bại";
                $scope.isSuccess = false;
            });
    }

    $scope.update = function () {
        const id = $scope.quiz.id;
        const apiUpdate = url + "/" + id; 
        console.log(id); 
        console.log(apiUpdate); 

        // Gọi API với method PUT
        $http.put(apiUpdate, $scope.quiz)
            .then(function (response) {
                // Tắt loading
                $scope.isLoading = false;

                // Thông báo
                $scope.message = "Sửa thành công";
                $scope.isSuccess = true;
            })
    }

    $scope.onDelete = function (index) {
        const id = $scope.list_quiz[index].id;
        const apiDelete = url + "/" + id;

        // Gọi API với method DELETE
        $http.delete(apiDelete)
            .then(function (response) {
                // Xóa trên table
                $scope.list_quiz.splice(index, 1);// splice để xóa tại index /xóa 1 phần tử
                location.reload();
            })
    }
    $scope.edit = function (index) {
        $scope.index = index;
        $scope.quiz = $scope.list_quiz[index];
    }
});