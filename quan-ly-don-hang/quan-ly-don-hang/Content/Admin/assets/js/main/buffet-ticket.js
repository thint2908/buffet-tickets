let buffetTicketId;
let data;

function loadData() {
	if ($.fn.DataTable.isDataTable("#tickets")) {
		$("#tickets").DataTable().destroy();
	}

	// Xóa dữ liệu cũ trong bảng
	$("#list-buffet-ticket").empty();

	fetch("/api/buffet-ticket")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				$(".number-ticket").text(data.Data.length);
				data.Data.forEach((ticket) => {
					let statusTicket = "";
					if (ticket.Active === 1) {
						statusTicket = '<span class="badge badge-success">Đang mở</span>';
					} else {
						statusTicket = '<span class="badge badge-danger">Đang đóng</span>';
					}

					let createdAt = new Date(ticket.CreatedAt);
					createdAt = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					let updatedAt = new Date(ticket.UpdatedAt);
					updatedAt = updatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					$("#list-buffet-ticket").append(`
                        <tr class="btn-buffet-ticket-details">
                            <td style="width: 2%; font-weight: bold;">${ticket.BuffetTicketID}</td>
                            <td style="width: 3%;">${ticket.Name}</td>
                            <td style="width: 2%;">${ticket.Price}</td>
                            <td style="width: 10%;">${statusTicket}</td>
                            <td style="width: 5%;">${createdAt}</td>
                            <td style="width: 5%;">${updatedAt}</td>
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
				$("#list-buffet-ticket").append(`
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
			$("#list-buffet-ticket").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút!
                    </td>
                </tr>
            `);
		});
}

function details() {
	$(".btn-buffet-ticket-details").click(function (e) {
		$("#modal-buffet-ticket-details .alert-success").hide();
		$("#modal-buffet-ticket-details .alert-danger").hide();
		$("#modal-buffet-ticket-details").modal("show");

		buffetTicketId = $(this).find("td:nth-child(1)").text();

		fetch("/api/buffet-ticket/" + buffetTicketId)
			.then((response) => response.json())
			.then((data) => {
				let ticket = data.Data;
				if (data.Success) {
					let statusTicket = "";
					if (ticket.Active === 1) {
						statusTicket = "Đang mở";
					} else {
						statusTicket = "Đang đóng";
					}

					let createdAt = new Date(ticket.CreatedAt);
					createdAt = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					let updatedAt = new Date(ticket.UpdatedAt);
					updatedAt = updatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
					$("#detailsBuffetTicketCode").val(ticket.BuffetTicketID);
					$("#detailsBuffetName").val(ticket.Name);
					$("#detailsBuffetPrice").val(ticket.Price);
					if (ticket.Active === 1) {
						$("#detailsBuffetActive").val(1);
					} else if (ticket.Active === 0) {
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
$("#modal-buffet-ticket-details").on("click", ".btn-edit", function () {
	$("#modal-buffet-ticket-edit").modal("show");
	let ticketName = $("#detailsBuffetName").val();
	let ticketPrice = $("#detailsBuffetPrice").val();

	if (ticketName.trim() === "") {
		$("#modal-buffet-ticket-edit").modal("hide");
		$("#modal-buffet-ticket-details").modal("show");
		$("#modal-buffet-ticket-details .alert-danger").text("Vui lòng nhập tên vé!").show();
		return;
	}

	if (ticketPrice.trim() === "") {
		$("#modal-buffet-ticket-edit").modal("hide");
		$("#modal-buffet-ticket-details").modal("show");
		$("#modal-buffet-ticket-details .alert-danger").text("Vui lòng nhập giá vé!").show();
		return;
	}

	data = {
		Name: ticketName,
		Price: ticketPrice,
	};
});
$(".btn-confirm-edit").click(function (e) {
	fetch(`/api/buffet-ticket/${buffetTicketId}`, {
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
				$("#modal-buffet-ticket-edit").modal("hide");
				$("#modal-buffet-ticket-details").modal("show");
				$("#modal-buffet-ticket-details .alert-success").text(data.Message).show();
				loadData();
			} else {
				$("#modal-buffet-ticket-edit").modal("hide");
				$("#modal-buffet-ticket-details").modal("show");
				$("#modal-buffet-ticket-details .alert-danger").text(data.Message).show();
			}
		})
		.catch((error) => {
			console.log(`Catch Error: ${error}`);
		});
});
// kết thúc xử lí chỉnh sửa thông tin vé

// xử lí xóa vé
$(".btn-delete").click(function () {
	$("#modal-buffet-ticket-delete").modal("show");
	$("#modal-buffet-ticket-details").modal("hide");
});
$(".btn-confirm-delete").click(function () {
	deleteData(buffetTicketId);
});

function deleteData(buffetTicketId) {
	/*$('.btn-delete').click(function () {*/

	fetch(`/api/buffet-ticket/${buffetTicketId}`, { method: "DELETE" })
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				$("#modal-buffet-ticket-delete").modal("hide");
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
	let ticketName = $("#createTicketName").val();
	let ticketPrice = $("#createTicketPrice").val();

	if (ticketName.trim() === "") {
		$("#modal-buffet-ticket-create .alert-danger").text("Vui lòng nhập tên vé!").show();
		return;
	}

	if (ticketPrice.trim() === "") {
		$("#modal-buffet-ticket-create .alert-danger").text("Vui lòng nhập giá vé!").show();
		return;
	}

	data = {
		Name: ticketName,
		Price: ticketPrice,
	};

	fetch("/api/buffet-ticket", {
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
				$("#modal-buffet-ticket-create .alert-success").text(data.Message).fadeIn().delay(1000).fadeOut();
				loadData();
			} else {
				$("#modal-buffet-ticket-create .alert-danger").text(data.Message).fadeIn().delay(1000).fadeOut();
			}
		})
		.catch((error) => {
			console.log(`Catch Error: ${error}`);
		});
}
// Kết Thúc thêm vé mới
$(document).ready(function () {
	loadData();

	$(".btn-buffet-ticket-create").click(function (e) {
		$("#modal-buffet-ticket-create").modal("show");
		$("#modal-buffet-ticket-create .alert-danger").hide();
		$("#modal-buffet-ticket-create .alert-success").hide();

		$(".btn-create").click(function (e) {
			create();
		});
	});

	$(".btn-buffet-ticket-refresh").click(function (e) {
		loadData();
	});
});
