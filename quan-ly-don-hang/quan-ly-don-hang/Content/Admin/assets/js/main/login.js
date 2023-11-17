$(document).ready(function () {
	/* xử lí validation fomr đăng nhập*/
	$("#form-login").submit(function (e) {
		e.preventDefault();
		$("#form-login").validate({
			rules: {
				email: {
					required: true,
					email: true,
				},
				password: {
					required: true,
					minlength: 6,
				},
			},
			messages: {
				email: {
					required: "Vui lòng nhập email đăng nhập!",
					email: "Vui lòng nhâp email hợp lệ!",
				},
				password: {
					required: "Vui lòng nhập mật khẩu!",
					minlength: "Mật khẩu phải dài hơn 6 kí tự",
				},
			},

			errorPlacement: function (error, element) {
				if (element.attr("name") === "email") {
					error.appendTo("#email-msg");
				} else if (element.attr("name") === "password") {
					error.appendTo("#password-msg");
				}
			},
		});

		if ($("#form-login").valid()) {
			login();
		}
	});
	/* ./xử lí validation fomr đăng nhập*/

	//$("#btn-login").on("click", function (e) {
	//    e.preventDefault();
	//    login();
	//});

	function login() {
		let email = $("#email").val(); // Lấy giá trị email từ form đăng nhập
		let password = $("#password").val(); // Lấy giá trị mật khẩu từ form đăng nhập

		const data = {
			Email: email,
			Password: password,
		};
		fetch("/api/login", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.Success) {
					let login = data;
					if (login.Success) {
						sessionStorage.setItem("loggedInUser", JSON.stringify(login.Data));
						window.location.href = "/";
					}
				} else {
					$("#msg-error").html(data.Message);
				}
			})
			.catch((error) => {
				//hiển thị thông báo lỗi nếu có
				console.log(`Catch error ${error}`);
			});
	}

	function loadUserInfo() {
		/*
   handle info user session 
   */
		const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

		// Sử dụng thông tin đăng nhập để hiển thị trên trang
		if (loggedInUser) {
			const username = loggedInUser.FullName;
			const email = loggedInUser.Email;

			$("#username_header").html("<i class='ti-user text-muted me-2''></i>" + username);
		}
		/*$("#username_header").html("<i class='ti - user text - muted me - 2''></i>");*/
	}
	loadUserInfo();
});
