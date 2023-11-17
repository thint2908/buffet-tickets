$(document).ready(function () {
    $("#form-register").submit(function (e) {
        e.preventDefault();
        $("#form-register").validate({
            rules: {
                fullname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 5,
                },
                confirm_password: {
                    required: true,
                    minlength: 5,
                    equalTo: "#password"
                },
                phone: {
                    required: true,
                    digits: true,
                    minlength: 10,
                    maxlength: 10
                },
                dob: {
                    required: true,
                    date: true
                },
                term: {
                    required: true
                }
            },
            messages: {
                fullname: {
                    required: "Vui lòng nhập Họ và Tên!"
                },
                email: {
                    required: "Vui lòng nhập Email đầy đủ!",
                    email: "Vui lòng nhập Email hợp lệ"
                },
                password: {
                    required: "Vui lòng nhập mật khẩu!",
                    minlength: "Mật khẩu phải dài hơn 6 kí tự!"
                },
                confirm_password: {
                    required: "Vui lòng nhập lại mật xác nhận!",
                    minlength: "Mật khẩu phải dài hơn 6 kí tự!",
                    equalTo: "Mật khẩu xác nhận không đúng!"
                },
                phone: {
                    required: "Vui lòng nhập giá trị",
                    digits: "Vui lòng nhập số",
                    minlength: "Vui lòng nhập đúng 10 số",
                    maxlength: "Vui lòng nhập đúng 10 số"
                },
                dob: {
                    required: "Vui lòng nhập ngày sinh!",
                    date: "Vui lòng nhập ngày sinh!"
                },
                term: {
                    required: "Để đăng kí tài khoản vui lòng đồng ý điều khoản!"
                }

            },

            errorPlacement: function (error, element) {
                if (element.attr("name") === "fullname") {
                    error.appendTo("#fullname-msg");
                } else if (element.attr("name") === "email") {
                    error.appendTo("#email-msg");
                } else if (element.attr("name") === "password") {
                    error.appendTo("#password-msg")
                } else if (element.attr("name") === "confirm_password") {
                    error.appendTo("#confirm_password-msg")
                } else if (element.attr("name") === "phone") {
                    error.appendTo("#phone-msg")
                } else if (element.attr("name") === "dob") {
                    error.appendTo("#dob-msg")
                } else if (element.attr("name") === "term") {
                    error.appendTo("#term-msg")
                }
            }
        });
        if ($("#form-register").valid()) {
            // Nếu validate thành công thì submit form
            register();
        }
    });
    // hàm xử lí đăng kí tài khoản
    function register() {
        const data = {
            FullName: $("#fullname").val(),
            Email: $("#email").val(),
            Phone: $("#phone").val(),
            Birthday: $("#dob").val(),
            Password: $("#password").val()
        }
        fetch("/api/register", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.Success)
                {
                    $("#register-msg").removeClass("text-danger");
                    $("#register-msg").addClass("text-success");
                    $("#register-msg").html(data.Message);
                }
                else
                {
                    $("#register-msg").removeClass("text-success");
                    $("#register-msg").addClass("text-danger");
                    $("#register-msg").html(data.Message);
                }
            })
            .catch((error) => {
                console.log(`Catch error ${error}`);
            })
    }
});