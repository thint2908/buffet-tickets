let foodStatus;
let foodDetailsStatus;
let categoryFood = {};
let typeFood;

function detailsMenuItem() {
	var url = window.location.pathname;
	const params = url.split("/");
	const idDetailFood = params[params.length - 1];
	$(".form-body").empty();
	fetch("/api/category-food/")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				/*data.Data.forEach((item) => {
                    categoryFood["CategoryFoodID"] = item.CategoryFoodID;
                    categoryFood["Name"] = item.Name;
                });*/
				categoryFood = data.Data.map((item) => {
					return { CategoryFoodID: item.CategoryFoodID, Name: item.Name };
				});
			}
		});

	fetch("/api/menu-item/" + idDetailFood)
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				let item = data.Data;

				let formattedPrice = parseFloat(item.Price).toLocaleString("vi-VN") + " VND";

				let createdAt = new Date(item.CreatedAt);
				let formattedCreatedAt = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

				let UpdatedAt = new Date(item.UpdatedAt);
				let formattedUpdatedAt = UpdatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

				if (item.Status == 0) {
					statusFood = `
                     <label class="radio-inline p-0 me-10">
                        <input type="radio" id="details-status-0" name="status" checked="checked" value="0">
                        <label for="details-status-0">Chưa Mở Bán</label>
                    </label>
                    <label class="radio-inline p-0 me-10">
                        <input type="radio" id="details-status-1" name="status" value="1">
                        <label for="details-status-1">Mở Bán</label>
                    </label>  
                    `;
				} else {
					statusFood = `
                     <label class="radio-inline p-0 me-10">
                        <input type="radio" id="details-status-0" name="status" value="0">
                        <label for="details-status-0">Chưa Mở Bán</label>
                    </label>
                    <label class="radio-inline p-0 me-10">
                        <input type="radio" id="details-status-1" name="status" checked="checked" value="1">
                        <label for="details-status-1">Mở Bán</label>
                    </label>
                    `;
				}

				for (let i = 0; i < categoryFood.length; i++) {
					let itemCate = categoryFood[i];
					if (item.CategoryFoodID === itemCate.CategoryFoodID) {
						typeFood = `
                            <option value="${item.CategoryFoodID}" selected="selected">${itemCate.Name}</option>
                        `;
						break;
					} else {
						typeFood = `
                            <option value="${item.CategoryFoodID}">${itemCate.Name}</option>
                        `;
					}
				}

				$(".form-body").append(`
					<div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="fw-700 fs-16 form-label">Tên Món Ăn</label>
                                        <input type="text" class="form-control" id="details-name" name="name" value="${item.Name}" placeholder="Nhập Tên Món Ăn">
                                    </div>
                                    <div class="form-group">
                                        <label class="fw-700 fs-16 form-label">Thể Loại Món Ăn</label>
                                        <select class="form-select" id="details-category_food_id" name="category_food_id">
                                            ${typeFood}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="fw-700 fs-16 form-label">Giá Món Ăn</label>
                                        <input type="number" class="form-control" id="details-price" name="price" value="${item.Price}" placeholder="Nhập Giá Món Ăn">
                                    </div>
                                    <div class="form-group">
                                        <label class="fw-700 fs-16 form-label">Trạng Thái Món Ăn</label>
                                        <div class="radio-list" style="padding-top: 5px;">${statusFood}</div >
                                    </div>
                                </div>
                                <!--/span-->
                                <div class="col-md-6">
                                    <form action="/Admin/MenuItem/Edit" id="from-menu-item-edit-image" method="post" enctype="multipart/form-data" onsubmit="return(validate('from-menu-item-edit-image'));">
                                        <div class="form-group" style="margin-bottom: 0px;">
                                            <label class="fw-700 fs-16 form-label">Hình Món Ăn</label>
                                        </div>
                                        <div class="input-group">
                                            <input type="hidden" class="form-control" id="details-id" name="id" value="${item.MenuItemID}">
                                            <input type="file" class="form-control" id="details-image" name="ImageUpload" accept="image/*" onchange="readUrl(this);" aria-describedby="details-image" aria-label="Upload">
                                        </div>
                                    </form>
                                    <div class="product-img text-start" style="margin-top: 1rem;">
                                        <img src="/Uploads/img/${item.Image}" id="view-image" alt="" height="210" width="210" >
                                    </div>
                                        <div class="form-group">
                                            <div class="msg-danger alert alert-danger position-absolute mt-1" style="padding: 10px 10px; border-radius: 5px; display: none; width: fit-content;">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="msg-success alert alert-success position-absolute mt-1" style="padding: 10px 10px; border-radius: 5px; display: none; width:fit-content;">
                                            </div>
                                        </div>
                                </div>
                                <!--/span-->
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="fw-700 fs-16 form-label">Mô Tả Món Ăn</label>
                                        <textarea class="form-control p-15" id="details-description" name="description" rows="4">${item.Description}</textarea >
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Thời Gian Tạo</label>
                                        <input type="text" id="details-created_at" value="${formattedCreatedAt}" class="form-control" disabled="disabled">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Thời Gian Cập Nhật</label>
                                        <input type="text" id="details-updated_at" value="${formattedUpdatedAt}" class="form-control" disabled="disabled">
                                    </div>
                                </div>
                            </div>
				`);
			}
		});

	//handle modal confirm edit menuItem
}

// chỉnh sửa thông tin món ăn

function editData() {
	let name = $("#details-name").val();
	let detailsID = $("#details-id").val();
	let category_food_id = $("#details-category_food_id").val();
	let price = $("#details-price").val();
	let description = $("#details-description").val();
	let status = document.querySelector("input[name='status']:checked").value;
	let image = $("#details-image").prop("files")[0];

	if (image === undefined) {
	}

	if (name.trim() === "") {
		$(".msg-danger")
			.text("Vui lòng nhập tên món ăn!")
			.show(
				setTimeout(function () {
					$(".msg-danger").hide();
				}, 3000)
			);
		return;
	}
	if (category_food_id.trim() === "") {
		$(".msg-danger")
			.text("Vui lòng chọn thể loại món ăn")
			.show(
				setTimeout(function () {
					$(".msg-danger").hide();
				}, 3000)
			);
		return;
	}
	if (price.trim() === "") {
		$(".msg-danger")
			.text("Vui lòng nhập giá tiền")
			.show(
				setTimeout(function () {
					$(".msg-danger").hide();
				}, 3000)
			);
		return;
	}

	$("#modal-menu-item-edit").modal("show");

	const formData = new FormData();
	formData.append("Name", name);
	formData.append("CategoryFoodID", category_food_id);
	formData.append("Price", price);
	formData.append("Status", status);
	formData.append("Description", description);
	formData.append("ImageUpload", image);
	formData.append("Active", "1");

	$("#btn-edit-confirm").click(function () {
		fetch("/api/menu-item/" + detailsID, {
			method: "PUT",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.Success) {
					$(".msg-success")
						.text(data.Message)
						.show(
							setTimeout(function () {
								$(".msg-success").hide();
							}, 3000)
						);
					$("#modal-menu-item-edit").modal("hide");
					console.log(data);
				} else {
					$(".msg-danger")
						.text(data.Message)
						.show(
							setTimeout(function () {
								$(".msg-danger").hide();
							}, 3000)
						);
					$("#modal-menu-item-edit").modal("hide");
					console.log(data);
				}
			})
			.catch((error) => {
				console.log("Error: " + error);
			});
	});
}
$(".btn-menu-item-edit").click(function () {
	editData();
});

// Xóa món ăn

function deleteData() {
	let detailsID = $("#details-id").val();

	$("#modal-menu-item-delete").modal("show");

	$("#btn-detele-confirm").click(function () {
		console.log(detailsID);
		fetch("/api/menu-item/" + detailsID, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.Success) {
					$(".msg-success")
						.text(data.Message)
						.show(
							setTimeout(function () {
								$(".msg-success").hide();
							}, 3000)
						);
					$("#modal-menu-item-delete").modal("hide");

					$("#details-name").val("");
					$("#details-price").val("");
					$("#details-description").val("");

					$("#details-category_food_id").val("");

					$("#details-status-0").prop("checked", true);
					$("#details-image").val("");
					$("#view-image").attr("src", "~/Content/Admin/assets/images/product/product-9.png");
					$("#details-created_at").val("");
					$("#details-updated_at").val("");
					console.log(data);
				} else {
					$(".msg-danger")
						.text(data.Message)
						.show(
							setTimeout(function () {
								$(".msg-danger").hide();
							}, 3000)
						);
					$("#modal-menu-item-delete").modal("hide");
					console.log(data);
				}
			})
			.catch((error) => {
				console.log("Error: " + error);
			});
	});
}

$(".btn-menu-item-delete").click(function () {
	deleteData();
});

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

$(document).ready(function () {
	detailsMenuItem();
});
