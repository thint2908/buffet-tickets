let servingTableID;
let data;

function loadData() {
	// Xóa DataTable cũ nếu tồn tại
	if ($.fn.DataTable.isDataTable("#tickets-cate")) {
		$("#tickets-cate").DataTable().destroy();
	}

	// Xóa dữ liệu cũ trong bảng
	$("#list-category-table").empty();

	// Gọi API để lấy dữ liệu
	fetch("/api/category-food")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				// Duyệt qua từng bản ghi và hiển thị lên bảng
				$(".number-cate").text(data.Data.length);
				data.Data.forEach((table, index) => {
					let createdAt = new Date(table.CreatedAt);
					let createdAtFomarted = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					let UpdatedAt = new Date(table.UpdatedAt);
					let UpdatedAtFomarted = UpdatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
					$("#list-category-table").append(`
                        <tr class="btn-category-food-details" data-id="${table.CategoryFoodID}" data-name="${table.Name}" data-description="${table.Description}" data-link="" data-meta="">
							<td style="font-weight: bold;">${table.CategoryFoodID}</td>
							<td><a href="#">${table.Name}</a></td>
							<td>${table.Description}</td>
							<td>${createdAtFomarted}</td>
							<td>${UpdatedAtFomarted}</td>
						</tr>
                    `);
				});
				$("#tickets-cate").DataTable({
					bDestroy: true, // Cho phép destroy dataTable
					paging: true, // Cho phép phân trang
					lengthChange: true, // Không cho phép thay đổi số lượng hiển thị trên trang
					searching: true, // Cho phép tìm kiếm
					ordering: true, // Cho phép sắp xếp
					info: true, // Cho phép hiển thị thông tin số trang và số lượng bản ghi
					autoWidth: false, // Tắt tự động thay đổi độ rộng của cột
					responsive: true, // Tự động thay đổi kích thước bảng theo kích thước màn hình
					language: {
						url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Vietnamese.json",
					},
				});

				detailsData();
				return;
			}
			// Hiển thị thông báo lỗi nếu có
			$("#list-category-table").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút !
                    </td>
                </tr>
            `);
		})
		.catch((error) => {
			// Hiển thị thông báo lỗi nếu có
			$("#list-category-table").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút !
                    </td>
                </tr>
            `);
		});
}

function refreshData() {
	$(".btn-category-food-refresh").click(function () {
		loadData();
	});
}

function detailsData() {
	$(".btn-category-food-details").click(function () {
		servingTableID = $(this).find("td:nth-child(1)").text();
		fetch("/api/category-food/" + servingTableID)
			.then((response) => response.json())
			.then((data) => {
				if (data.Success) {
					$("#details-name").val(data.Data.Name);
					$("#details-description").val(data.Data.Description);

					let createdAt = new Date(data.Data.CreatedAt);
					let formattedcreatedAt = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					let UpdatedAt = new Date(data.Data.UpdatedAt);
					let formattedUpdatedAt = UpdatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					$("#details-created_at").val(formattedcreatedAt);
					$("#details-updated_at").val(formattedUpdatedAt);

					$("#modal-category-food-details").modal("show");
					$("#modal-category-food-details .alert-success").text("").hide();
					$("#modal-category-food-details .alert-danger").text("").hide();
				}
			});
	});
}

function createData() {
	$(".btn-category-food-create").click(function () {
		$("#modal-category-food-create").modal("show");
	});

	$("#modal-category-food-create").on("click", ".btn-create", function () {
		// Lấy giá trị của các trường input
		const categoryName = $("#create-name").val();
		const categoryDescription = $("#create-description").val();

		$("#modal-category-food-create .alert-success").hide();
		$("#modal-category-food-create .alert-danger").hide();

		// Kiểm tra giá trị của các trường input
		if (categoryName.trim() === "") {
			$("#modal-category-food-create .alert-danger").text("Vui lòng nhập thể loại món ăn!").show();
			return;
		}

		if (categoryDescription.trim() === "") {
			$("#modal-category-food-create .alert-danger").text("Vui lòng nhập mô tả thể loại món ăn!").show();
			return;
		}

		// Tạo đối tượng dữ liệu để gửi lên server
		const data = {
			Name: categoryName,
			Description: categoryDescription,
		};

		// Gửi dữ liệu lên server bằng fetch
		fetch("/api/category-food", {
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
					$("#create-name").val("");
					$("#create-description").val("");
					$("#modal-category-food-create .alert-success").text(data.Message).show();
					loadData();
				} else {
					$("#modal-category-food-create .alert-danger").text(data.Message).show();
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
}

$(".btn-category-food-delete").click(function () {
	$("#modal-category-food-delete").modal("show");
	$("#modal-category-food-details").modal("hide");
});
$(".btn-delete").click(function () {
	deleteData(servingTableID);
});

function deleteData(servingTableID) {
	/*$('.btn-delete').click(function () {*/

	fetch(`/api/category-food/${servingTableID}`, { method: "DELETE" })
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				$("#modal-category-food-delete").modal("hide");
				loadData();
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
	/*})*/
}
/*start hadle edit data*/
$("#modal-category-food-details").on("click", ".btn-category-food-edit", function () {
	const categoryName = $("#details-name").val();
	const categoryDescription = $("#details-description").val();
	console.log(`Name ${categoryName}, Desc: ${categoryDescription}`);

	if (categoryName.trim() === "") {
		$("#modal-category-food-edit").modal("hide");
		$("#modal-category-food-details").modal("show");
		$("#modal-category-food-details .alert-danger").text("Vui lòng nhập thể loại món ăn!").show();
		return;
	} else {
		$("#modal-category-food-details").modal("hide");
		$("#modal-category-food-edit").modal("show");

		data = {
			Name: categoryName,
			Description: categoryDescription,
		};
	}
});
$(".btn-edit").click(function () {
	fetch(`/api/category-food/${servingTableID}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				$("#modal-category-food-edit").modal("hide");
				$("#modal-category-food-details").modal("show");
				$("#modal-category-food-details .alert-success").text(data.Message).show();
				loadData();
			} else {
				$("#modal-category-food-edit").modal("hide");
				$("#modal-category-food-details").modal("show");
				$("#modal-category-food-details .alert-danger").text(data.Message).show();
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
});

/*end handle edit data*/

$(document).ready(function () {
	loadData();

	refreshData();

	createData();
});
