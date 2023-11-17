function validate(formName) {
    const inputs = document.getElementById(formName).elements;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].nodeName === "INPUT" && inputs[i].type === "text") {
            if (inputs[i].value == "" && inputs[i].name != "description" && inputs[i].name != "link") {
                inputs[i].focus();
                alert("Vui lòng không bỏ trống thông tin!");
                return (false);
            }
        }

        if (inputs[i].nodeName === "INPUT" && inputs[i].type === "file") {
            if (inputs[i].value == "") {
                inputs[i].focus();
                alert("Vui lòng chọn một hình ảnh để tải lên!");
                return (false);
            }
        }

        if (inputs[i].nodeName === "INPUT" && inputs[i].type === "number") {
            if (inputs[i].value == "") {
                inputs[i].focus();
                alert("Vui lòng không bỏ trống thông tin!");
                return (false);
            }
        }
    }
    return (true);
}

function validateImage(formName) {
    const inputs = document.getElementById(formName).elements;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].nodeName === "INPUT" && inputs[i].type === "file") {
            if (inputs[i].value == "") {
                inputs[i].focus();
                alert("Vui lòng chọn một hình ảnh để tải lên!");
                return (false);
            }
        }
    }
    return (true);
}

var LoadImage = function (event, id) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById(id);
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};

// ServingTable
function ServingTableDetails(id, code_id, capacity, description, link, meta, status, created_at, updated_at) {
    $('#details-id').val(id);
    $('#details-code_id').val(code_id);
    $('#details-capacity').val(capacity);
    $('#details-link').val(link);
    $('#details-meta').val(meta);
    $('#details-description').val(description);

    if (status == 0) {
        $('#details-status').html("Đang đóng");
        $("#details-status").attr('class', 'badge badge-danger');
    }
    if (status == 1) {
        $('#details-status').html("Đang mở");
        $("#details-status").attr('class', 'badge badge-success');
    }
    if (status == 2) {
        $('#details-status').html("Đặt trước")
        $("#details-status").attr('class', 'badge badge-dark');
    }

    if (created_at != '') {
        $('#details-created_at').val(created_at);
    }
    if (updated_at != '') {
        $('#details-updated_at').val(updated_at);
    }

    $('#modal-serving-table-details').modal('show');
}

function ServingTableEdit() {
    var id = $('#details-id').val();
    var code_id = $('#details-code_id').val();
    var capacity = $('#details-capacity').val();
    var link = $('#details-link').val();
    var description = $('#details-description').val();

    $('#edit-id').val(id);
    $('#edit-code_id').val(code_id);
    $('#edit-capacity').val(capacity);
    $('#edit-link').val(link);
    $('#edit-description').val(description);

    $('#modal-serving-table-details').modal('hide');
    $('#modal-serving-table-edit').modal('show');
}

function ServingTableDelete() {
    var id = $('#details-id').val();
    $('#delete-id').val(id);
    $('#modal-serving-table-details').modal('hide');
    $('#modal-serving-table-delete').modal('show');
}

// CategoryFood
function CategoryFoodDetails(id, name, description, link, meta, created_at, updated_at) {
    $('#details-id').val(id);
    $('#details-name').val(name);
    $('#details-link').val(link);
    $('#details-meta').val(meta);
    $('#details-description').val(description);

    if (created_at != '') {
        $('#details-created_at').val(created_at);
    }

    if (updated_at != '') {
        $('#details-updated_at').val(updated_at);
    }

    $('#modal-category-food-details').modal('show');
}

function CategoryFoodEdit() {
    var id = $('#details-id').val();
    var name = $('#details-name').val();
    var link = $('#details-link').val();
    var description = $('#details-description').val();

    $('#edit-id').val(id);
    $('#edit-name').val(name);
    $('#edit-link').val(link);
    $('#edit-description').val(description);

    $('#modal-category-food-details').modal('hide');
    $('#modal-category-food-edit').modal('show');
}

function CategoryFoodDelete() {
    var id = $('#details-id').val();
    $('#delete-id').val(id);
    $('#modal-category-food-details').modal('hide');
    $('#modal-category-food-delete').modal('show');
}

// MenuItem
function MenuItemEdit(id, name, category_food_id, price, status, link, description) {
    $('#edit-id').val(id);
    $('#edit-name').val(name);
    $('#edit-category_food_id').val(category_food_id);
    $('#edit-price').val(price);
    $('#edit-status').val(status);
    $('#edit-link').val(link);
    $('#edit-description').val(description);
    $('#modal-menu-item-edit').modal('show');
}

function MenuItemDelete(id) {
    $('#delete-id').val(id);
    $('#modal-menu-item-delete').modal('show');
}

$(document).ready(function () {
    $(".btn-serving-table-details").click(function () {
        var id = $(this).data("id");
        var code_id = $(this).data("code_id");
        var capacity = $(this).data("capacity");
        var description = $(this).data("description");
        var link = $(this).data("link");
        var meta = $(this).data("meta");
        var status = $(this).data("status");
        var created_at = $(this).data("created-at");
        var updated_at = $(this).data("updated-at");
        ServingTableDetails(id, code_id, capacity, description, link, meta, status, created_at, updated_at)
    });

    $('#modal-serving-table-details').on('click', '.btn-serving-table-edit', function () {
        ServingTableEdit();
    });

    $('#modal-serving-table-details').on('click', '.btn-serving-table-delete', function () {
        ServingTableDelete();
    });

    $(".btn-category-food-details").click(function () {
        var id = $(this).data("id");
        var name = $(this).data("name");
        var description = $(this).data("description");
        var link = $(this).data("link");
        var meta = $(this).data("meta");
        var created_at = $(this).data("created-at");
        var updated_at = $(this).data("updated-at");
        CategoryFoodDetails(id, name, description, link, meta, created_at, updated_at)
    });

    $('#modal-category-food-details').on('click', '.btn-category-food-edit', function () {
        CategoryFoodEdit();
    });

    $('#modal-category-food-details').on('click', '.btn-category-food-delete', function () {
        CategoryFoodDelete();
    });

    $(".btn-menu-item-edit").click(function () {
        var id = $('#details-id').val();
        var name = $('#details-name').val();
        var category_food_id = $('#details-category_food_id').val();
        var price = $('#details-price').val();
        var status = 0;

        if ($('#details-status-1').is(":checked")) {
            var status = 1;
        }

        var link = $('#details-link').val();
        var description = $('#details-description').val();
        MenuItemEdit(id, name, category_food_id, price, status, link, description);
    });

    $(".btn-menu-item-delete").click(function () {
        var id = $('#details-id').val();
        MenuItemDelete(id);
    });


    loadUserInfo();
});



function loadUserInfo() {
    /*
handle info user session 
*/
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // Sử dụng thông tin đăng nhập để hiển thị trên trang
    if (loggedInUser) {
        const username = loggedInUser.FullName;
        const email = loggedInUser.Email;

        $("#username_header").html(username);
        $("#logout").css("display", "block");
        $("#login").css("display", "none");
    }
    /*$("#username_header").html("<i class='ti - user text - muted me - 2''></i>");*/
}

function removeSession() {
    sessionStorage.removeItem('loggedInUser');

    // Chuyển hướng về trang đăng nhập
    window.location.href = '/Admin/Home/Login';
}