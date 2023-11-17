function loadData() {
	// Xóa DataTable cũ nếu tồn tại
	if ($.fn.DataTable.isDataTable("#tickets")) {
		$("#tickets").DataTable().destroy();
	}

	// Xóa dữ liệu cũ trong bảng
	$("#list-serving-table").empty();

	// Gọi API để lấy dữ liệu
	fetch("/api/serving-table")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				// Duyệt qua từng bản ghi và hiển thị lên bảng
				data.Data.forEach((table, index) => {
					$(".number-table").text(data.Data.length);
					let statusHTML = "";
					if (table.Status === 0) {
						statusHTML = '<span class="badge badge-danger">Đang đóng</span>';
					} else if (table.Status === 1) {
						statusHTML = '<span class="badge badge-success">Đang mở</span>';
					} else if (table.Status === 2) {
						statusHTML = '<span class="badge badge-dark">Đặt trước</span>';
					}

					let createdAt = new Date(table.CreatedAt);
					let formattedDate = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					$("#list-serving-table").append(`
                        <tr class="btn-serving-table-details">
                        <td style="width: 2%; font-weight: bold;">${table.ServingTableID}</td>
                        <td style="width: 3%;"><a href="#">${table.ServingTableCode}</a></td>
                        <td style="width: 2%;">${table.Capacity}</td>
                        <td style="width: 10%;">${statusHTML}</td>
                        <td style="width: 5%;">${formattedDate}</td>
                    </tr>
                    `);
				});

				$("#tickets").DataTable({
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
			$("#list-serving-table").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút!
                    </td>
                </tr>
            `);
		})
		.catch((error) => {
			// Hiển thị thông báo lỗi nếu có
			$("#list-serving-table").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút!
                    </td>
                </tr>
            `);
		});
}

function refreshData() {
	$(".btn-serving-table-refresh").click(function () {
		loadData();
	});
}

function detailsData() {
	$(".btn-serving-table-details").click(function () {
		var servingTableID = $(this).find("td:nth-child(1)").text();
		fetch("/api/serving-table/" + servingTableID)
			.then((response) => response.json())
			.then((data) => {
				if (data.Success) {
					$("#detailsServingTableCode").val(parseInt(data.Data.ServingTableCode.split(" ")[1]));
					$("#detailsCapacity").val(data.Data.Capacity);
					$("#detailsDescription").val(data.Data.Description);

					let createdAt = new Date(data.Data.CreatedAt);
					let formattedcreatedAt = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					let UpdatedAt = new Date(data.Data.UpdatedAt);
					let formattedUpdatedAt = UpdatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					$("#detailCreatedAt").val(formattedcreatedAt);
					$("#detailsUpdatedAt").val(formattedUpdatedAt);

					var status = data.Data.Status;
					switch (status) {
						case 0:
							$("#detailsStatus").html("Đang đóng");
							$("#detailsStatus").attr("class", "badge badge-danger");
							break;
						case 1:
							$("#detailsStatus").html("Đang mở");
							$("#detailsStatus").attr("class", "badge badge-success");
							break;
						case 2:
							$("#detailsStatus").html("Đặt trước");
							$("#detailsStatus").attr("class", "badge badge-dark");
							break;
					}

					editData(servingTableID);
					deleteData(servingTableID);
					$("#modal-serving-table-details").modal("show");
				}
			});
	});
}

function createData() {
	$(".btn-serving-table-create").click(function () {
		$("#modal-serving-table-create").modal("show");
	});

	$("#modal-serving-table-create").on("click", ".btn-create", function () {
		// Lấy giá trị của các trường input
		const servingTableCode = $("#createServingTableCode").val();
		const capacity = $("#createCapacity").val();
		const description = $("#createDescription").val();

		$("#modal-serving-table-create .alert-success").hide();
		$("#modal-serving-table-create .alert-danger").hide();

		// Kiểm tra giá trị của các trường input
		if (servingTableCode.trim() === "") {
			$("#modal-serving-table-create .alert-danger").text("Vui lòng nhập mã bàn phục vụ").show();
			return;
		}

		if (capacity.trim() === "") {
			$("#modal-serving-table-create .alert-danger").text("Vui lòng nhập sức chứa").show();
			return;
		}

		// Tạo đối tượng dữ liệu để gửi lên server
		const data = {
			ServingTableCode: "Bàn " + servingTableCode,
			Capacity: capacity,
			Description: description,
		};

		// Gửi dữ liệu lên server bằng fetch
		fetch("/api/serving-table", {
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
					$("#createServingTableCode").val("");
					$("#createCapacity").val("");
					$("#createDescription").val("");
					loadData();
					$("#modal-serving-table-create .alert-success").text(data.Message).show();
				} else {
					$("#modal-serving-table-create .alert-danger").text(data.Message).show();
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
}

function deleteData(servingTableID) {
	$("#modal-serving-table-details").on("click", ".btn-delete", function () {
		$("#modal-serving-table-delete").modal("show");
		$("#modal-serving-table-details").modal("hide");
	});

	$("#modal-serving-table-delete").on("click", ".btn-delete", function () {
		fetch(`/api/serving-table/${servingTableID}`, { method: "DELETE" })
			.then((response) => response.json())
			.then((data) => {
				if (data.Success) {
					loadData();
					$("#modal-serving-table-delete").modal("hide");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
}

function editData(servingTableID) {
	$("#modal-serving-table-details .alert-success").hide();
	$("#modal-serving-table-details .alert-danger").hide();

	$("#modal-serving-table-details").on("click", ".btn-edit", function () {
		$("#modal-serving-table-details .alert-success").hide();
		$("#modal-serving-table-details .alert-danger").hide();
		$("#modal-serving-table-edit").modal("show");
		$("#modal-serving-table-details").modal("hide");
	});

	$("#modal-serving-table-edit").on("click", ".btn-edit", function () {
		$("#modal-serving-table-details .alert-success").hide();
		$("#modal-serving-table-details .alert-danger").hide();

		const servingTableCode = $("#detailsServingTableCode").val();
		const capacity = $("#detailsCapacity").val();
		const description = $("#detailsDescription").val();

		// Kiểm tra giá trị của các trường input
		if (servingTableCode.trim() === "") {
			$("#modal-serving-table-edit").modal("hide");
			$("#modal-serving-table-details").modal("show");
			$("#modal-serving-table-details .alert-danger").text("Vui lòng nhập mã bàn phục vụ").show();
			return;
		}

		if (capacity.trim() === "") {
			$("#modal-serving-table-edit").modal("hide");
			$("#modal-serving-table-details").modal("show");
			$("#modal-serving-table-details .alert-danger").text("Vui lòng nhập sức chứa").show();
			return;
		}

		const data = {
			ServingTableCode: "Bàn " + servingTableCode,
			Capacity: capacity,
			Description: description,
		};

		fetch(`/api/serving-table/${servingTableID}`, {
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
					$("#modal-serving-table-edit").modal("hide");
					$("#modal-serving-table-details").modal("show");
					$("#modal-serving-table-details .alert-success").text(data.Message).show();
				} else {
					$("#modal-serving-table-edit").modal("hide");
					$("#modal-serving-table-details").modal("show");
					$("#modal-serving-table-details .alert-danger").text(data.Message).show();
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
}

$(document).ready(function () {
	loadData();
	refreshData();
	createData();
});
