let buffetTicketMenuItemId;
let data;

function loadData() {
	if ($.fn.DataTable.isDataTable("#tickets")) {
		$("#tickets").DataTable().destroy();
	}

	// Xóa dữ liệu cũ trong bảng
	$("#list-buffet-ticket-menu-item").empty();

	fetch("/api/buffet-ticket-menu-item")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				$(".number-ticket-menu-item").text(data.Data.length);
				data.Data.forEach((item) => {
					$("#list-buffet-ticket-menu-item").append(`
                        <tr class="btn-buffet-ticket-menu-item-details">
                            <td style="width: 5% ; font-weight: bold;">${item.MenuItemID}</td>
                            <td style="width: 10%;">${item.BuffetTicket.Name}</td>
                            <td style="width: 10%;">${item.BuffetTicket.Price}</td>
                            <td style="width: 20%;">${item.MenuItem.CategoryFood.Name}</td>
                            <td style="width: 25%;">${item.MenuItem.Name}</td>
                            <td style="width: 30%;"><img src="/Uploads/img/${item.MenuItem.Image}" alt=""></td>
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
				details();
				return;
			} else {
				$("#list-buffet-ticket-menu-item").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút!
                    </td>
                </tr>
            `);
			}
		})
		.catch(function (err) {
			// Hiển thị thông báo lỗi nếu có
			$("#list-buffet-ticket-menu-item").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút!
                    </td>
                </tr>
            `);
		});
}

function details() {
	$(".btn-buffet-ticket-menu-item-details").click(function (e) {
		$("#modal-buffet-ticket-menu-item-details .alert-success").hide();
		$("#modal-buffet-ticket-menu-item-details .alert-danger").hide();
		$("#modal-buffet-ticket-menu-item-details").modal("show");

		buffetTicketMenuItemId = $(this).find("td:nth-child(1)").text();

		fetch("/api/buffet-ticket-menu-item/" + buffetTicketMenuItemId)
			.then((response) => response.json())
			.then((data) => {
				let item = data.Data;
				if (data.Success) {
					let statusTicket = "";
					if (item.BuffetTicket.Status === 1) {
						statusTicket = "Đang mở";
					} else {
						statusTicket = "Đang đóng";
					}

					let createdAt = new Date(item.BuffetTicket.CreatedAt);
					createdAt = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					let updatedAt = new Date(item.BuffetTicket.UpdatedAt);
					updatedAt = updatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
					$("#detailsBuffetTicketMenuItemNameFood").val(item.MenuItem.Name);
					$("#detailsBuffetTicketMenuItemName").val(item.BuffetTicket.Name);
					$("#detailsBuffetPrice").val(item.BuffetTicket.Price);
					if (item.BuffetTicket.Status === 1) {
						$("#detailsBuffetActive").val(1);
					} else if (item.BuffetTicket.Status === 0) {
						$("#detailsBuffetActive").val(0);
					}
					$("#detailsCreatedAt").val(createdAt);
					$("#detailsUpdatedAt").val(updatedAt);
				} else {
					console.log(data);
				}
			});
	});
}

// Xử lí chỉnh sửa thông tin vé
$("#modal-buffet-ticket-menu-item-details").on("click", ".btn-edit", function () {
	$("#modal-buffet-ticket-menu-item-edit").modal("show");
	let ticketName = $("#detailsBuffetName").val();
	let ticketPrice = $("#detailsBuffetPrice").val();

	if (ticketName.trim() === "") {
		$("#modal-buffet-ticket-menu-item-edit").modal("hide");
		$("#modal-buffet-ticket-menu-item-details").modal("show");
		$("#modal-buffet-ticket-menu-item-details .alert-danger").text("Vui lòng nhập tên vé!").show();
		return;
	}

	if (ticketPrice.trim() === "") {
		$("#modal-buffet-ticket-menu-item-edit").modal("hide");
		$("#modal-buffet-ticket-menu-item-details").modal("show");
		$("#modal-buffet-ticket-menu-item-details .alert-danger").text("Vui lòng nhập giá vé!").show();
		return;
	}

	data = {
		Name: ticketName,
		Price: ticketPrice,
	};
});
$(".btn-confirm-edit").click(function (e) {
	fetch(`/api/buffet-ticket-menu-item/${buffetTicketMenuItemId}`, {
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
				$("#modal-buffet-ticket-menu-item-edit").modal("hide");
				$("#modal-buffet-ticket-menu-item-details").modal("show");
				$("#modal-buffet-ticket-menu-item-details .alert-success").text(data.Message).show();
				loadData();
			} else {
				$("#modal-buffet-ticket-menu-item-edit").modal("hide");
				$("#modal-buffet-ticket-menu-item-details").modal("show");
				$("#modal-buffet-ticket-menu-item-details .alert-danger").text(data.Message).show();
			}
		})
		.catch((error) => {
			console.log(`Catch Error: ${error}`);
		});
});
// kết thúc xử lí chỉnh sửa thông tin vé

// xử lí xóa vé
$(".btn-delete").click(function () {
	$("#modal-buffet-ticket-menu-item-delete").modal("show");
	$("#modal-buffet-ticket-menu-item-details").modal("hide");
});
$(".btn-confirm-delete").click(function () {
	deleteData(buffetTicketMenuItemId);
});

function deleteData(buffetTicketMenuItemId) {
	/*$('.btn-delete').click(function () {*/

	fetch(`/api/buffet-ticket-menu-item/${buffetTicketMenuItemId}`, { method: "DELETE" })
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				$("#modal-buffet-ticket-menu-item-delete").modal("hide");
				loadData();
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
	/*})*/
}
// kết thúc xử lí xóa vé

// Thêm vé mới

function create() {
	let ticketBuffet = $("#createBuffetTicket").val();
	let ticketName = $("#createBuffetTicketName").val();

	if (ticketBuffet == null) {
		$("#modal-buffet-ticket-menu-item-create .alert-danger").text("Vui Lòng Chọn Loại Vé!").show();
		return;
	}

	if (ticketName == null) {
		$("#modal-buffet-ticket-menu-item-create .alert-danger").text("Vui Lòng Chọn Món Ăn!").show();
		return;
	}

	data = {
		BuffetTicketID: ticketBuffet,
		MenuItemID: ticketName,
	};

	fetch("/api/buffet-ticket-menu-item", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				$("#modal-buffet-ticket-menu-item-create .alert-success").text(data.Message).fadeIn().delay(1000).fadeOut();
				loadData();
			} else {
				$("#modal-buffet-ticket-menu-item-create .alert-danger").text(data.Message).fadeIn().delay(1000).fadeOut();
			}
		})
		.catch((error) => {
			console.log(`Catch Error: ${error}`);
		});
}
// Kết Thúc thêm vé mới
$(document).ready(function () {
	loadData();

	$(".btn-buffet-ticket-menu-item-create").click(function (e) {
		$("#modal-buffet-ticket-menu-item-create").modal("show");
		$("#modal-buffet-ticket-menu-item-create .alert-danger").hide();
		$("#modal-buffet-ticket-menu-item-create .alert-success").hide();

		$(".btn-create").click(function (e) {
			create();
		});
	});

	$(".btn-buffet-ticket-menu-item-refresh").click(function (e) {
		loadData();
	});
	// Lấy dữ liệu cho phân thêm mới
	fetch("/api/buffet-ticket")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				data.Data.forEach((item) => {
					$("#createBuffetTicket").append(`
							<option value="${item.BuffetTicketID}">${item.Name}</option >
					`);
					// $("createBuffetTicketName").append(`
					// 		<option value="${item.MenuItem.MenuItemID}">${item.MenuItem.Name}</option >
					// `);
				});
			} else {
				console.log(data);
			}
		})
		.catch((error) => {
			console.log(`Catch error ${error}`);
		});

	fetch("/api/menu-item")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				data.Data.forEach((item) => {
					$("#createBuffetTicketName").append(`
							<option value="${item.MenuItemID}">${item.Name}</option >
					`);
				});
			} else {
				console.log(data);
			}
		})
		.catch((error) => {
			console.log(`Catch error ${error}`);
		});
	// Kết thúc phần lấy dữ liệu cho phần thêm mới.
});
