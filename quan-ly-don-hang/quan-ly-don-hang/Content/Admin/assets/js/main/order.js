function loadData() {
	if ($.fn.DataTable.isDataTable("#tickets")) {
		$("#tickets").DataTable().destroy();
	}

	// Xóa dữ liệu cũ trong bảng
	$("#list-order").empty();

	fetch("/api/order")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				let order = data.Data;

				$(".number-order").text(order.length);
				order.forEach((item) => {
					let statusTicket = "";
					if (item.Status === 1) {
						statusTicket = '<span class="badge badge-success">Đang mở</span>';
					} else {
						statusTicket = '<span class="badge badge-danger">Đang đóng</span>';
					}

					let createdAt = new Date(item.CreatedAt);
					createdAt = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					let updatedAt = new Date(item.UpdatedAt);
					updatedAt = updatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					let formatted_price = parseFloat(item.PriceBuffetTicket).toLocaleString("vi-VN") + " VND";

					$("#list-order").append(`
                            <tr class="btn-order-details">
                                <td style="width: 2%; font-weight: bold;">${item.OrderID}</td>
                                <td style="width: 3%;">${item.ServingTableID}</td>
                                <td style="width: 2%;">${item.BuffetTicketID}</td>
                                <td style="width: 10%;">${item.EmployeeID} - ${item.Employee.FullName}</td>
                                <td style="width: 5%;">${formatted_price}</td>
                                <td style="width: 5%;">${item.DiscountPrice}</td>
                                <td style="width: 5%;">${item.Quantity}</td>
                                <td style="width: 5%;">${statusTicket}</td>
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
			}
		});
}

$(document).ready(function () {
	loadData();
});
