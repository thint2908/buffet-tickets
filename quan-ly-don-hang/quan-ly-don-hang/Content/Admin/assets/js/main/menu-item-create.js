

// Display image after choose file
function readUrl(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $("#view-image").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// lấy dữ liệu của form để gởi qua api

function createData() {
    // Lấy các giá trị của các ô input
    const name = document.querySelector("#create-name").value;
    const category_food_id = document.querySelector("#create-category_food_id").value;
    const price = document.querySelector("#create-price").value;
    const status = document.querySelector("input[name='status']:checked").value;
    const description = document.querySelector("#create-description").value;
    const image = document.querySelector("#create-image").files[0];

    if (name.trim() === '') {
        $(".msg-danger").text("Vui lòng nhập tên món ăn!").show(setTimeout(function () {$('.msg-danger').hide();}, 3000));
        return;
    }
    if (category_food_id.trim() === '') {
        $(".msg-danger").text("Vui lòng chọn thể loại món ăn").show(setTimeout(function () { $('.msg-danger').hide(); }, 3000));
        return;
    }
    if (price.trim() === '') {
        $(".msg-danger").text("Vui lòng nhập giá tiền").show(setTimeout(function () { $('.msg-danger').hide(); }, 3000));
        return;
    }
    if (image === undefined) {
        $(".msg-danger").text("Vui lòng thêm ảnh món ăn").show(setTimeout(function () { $('.msg-danger').hide(); }, 3000));
        return;
    }
    // Tạo đối tượng FormData và đưa các giá trị vào
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("CategoryFoodID", category_food_id);
    formData.append("Price", price);
    formData.append("Status", status);
    formData.append("Description", description);
    formData.append("ImageUpload", image);
    formData.append("Active", "1");

    fetch("/api/menu-item", {
        method: "POST",
        body: formData,
        
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.Success) {
                $(".msg-success").text(data.Message).show(setTimeout(function () { $('.msg-success').hide(); }, 3000));
                $('#create-name').val('');
                $('#create-price').val('');
                $('#create-description').val('');

                $('#create-category_food_id').val('');

                $('#create-status-0').prop('checked', true);
                $("#create-image").val("");
                $('#view-image').attr('src', '~/Content/Admin/assets/images/product/product-9.png');
            } else {
                $(".msg-danger").text(data.Message).show(setTimeout(function () { $('.msg-danger').hide(); }, 3000));
            }
        })
        .catch((error) => {
            console.log("error: " + error);
        })

}
$("#btn-menu-item-create").click(function () {
    createData();
});

//Lấy dữ liệu categoryFood

function getCatFood() {
    fetch("/api/category-food")
        .then((response) => response.json())
        .then((data) => {
            if (data.Success) {
                data.Data.forEach((item) => {
                    $("#create-category_food_id").append(`
                        <option value="${item.CategoryFoodID}">${item.Name}</option >
                    `)
                });
            }
            else
            {
                console.log(data.Data);
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        })
}



$(document).ready(function () {
    getCatFood();

});