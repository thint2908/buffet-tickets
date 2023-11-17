let foodStatus;
let foodDetailsStatus;
let categoryFood = {};
let typeFood;

function loadData() {
	// Xóa DataTable cũ nếu tồn tại
	if ($.fn.DataTable.isDataTable("#tickets-menuItem")) {
		$("#tickets-menuItem").DataTable().destroy();
	}

	// Xóa dữ liệu cũ trong bảng
	$("#list-menuItem-table").empty();

	// Gọi API để lấy dữ liệu
	fetch("/api/menu-item")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				// Duyệt qua từng bản ghi và hiển thị lên bảng
				$(".number-menuItem").text(data.Data.length);
				data.Data.forEach((table, index) => {
					if (table.Status === 0) {
						foodStatus = '<td><span class="badge badge-danger">Hết nguyên liệu</span></td>';
					}
					if (table.Status === 1) {
						foodStatus = '<td><span class="badge badge-success">Còn nguyên liệu</span></td>';
					}

					let formatted_price = parseFloat(table.Price).toLocaleString("vi-VN") + " VND";

					let createdAt = new Date(table.CreatedAt);
					let createdAtFomarted = createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

					$("#list-menuItem-table").append(`
                        <tr class="btn-menu-item-details" data-id="${table.MenuItemID}" data-name="${table.Name}" data-description="${table.Description}" data-link="" data-meta="">
							<td style="font-weight: bold;">${table.MenuItemID}</td>
							<td><a href="MenuItem/Details/${table.MenuItemID}">${table.Name}</a></td>
							<td style="text-align: right;">${formatted_price}</td>
							${foodStatus}
							<td>${createdAtFomarted}</td>
						</tr>
                    `);
				});
				$("#tickets-menuItem").DataTable({
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

				return;
			}
			// Hiển thị thông báo lỗi nếu có
			$("#list-menuItem-table").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút !
                    </td>
                </tr>
            `);
		})
		.catch((error) => {
			// Hiển thị thông báo lỗi nếu có
			$("#list-menuItem-table").append(`
                <tr>
                    <td colspan="6">
                        Đang tải dữ liệu xin vui lòng đờ trong giây phút !
                    </td>
                </tr>
            `);
		});

	fetch("/api/category-food")
		.then((response) => response.json())
		.then((data) => {
			if (data.Success) {
				$(".number-cate").text(data.Data.length);
				data.Data.forEach((item) => {
					$("#media-list-cate").append(`
						<div class="media media-single">
							<div class="media-body">
								<h6><a href="${item.CategoryFoodID}">${item.Name}</a></h6>
							</div>
						</div>
					`);
				});
			}
		});
}

$(document).ready(function () {
	loadData();
});

/*
 
    <div class="row">
    <div class="col-md-6">
        <div class="form-group">
            <label class="fw-700 fs-16 form-label">Link</label>
            <input type="text" class="form-control" id="details-link" name="link" value="@*@Model.MenuItems[0].link*@" placeholder="http://">
        </div>
    </div>
    <div class="col-md-6">
        <div class="form-group">
            <label class="fw-700 fs-16 form-label">Mô Tả Món Ăn</label>
            <input type="text" class="form-control" id="details-meta" name="meta" value="@*@Model.MenuItems[0].meta*@" disabled="disabled" placeholder="the-loai-nuoc-ngot">
        </div>
    </div>
</div>
 */

/*
 *@*@foreach (var item in Model.CategoryFoods)
{
    if (Model.MenuItems[0].category_food_id == item.id)
    {
        <option value="@item.id" selected="selected">@item.name</option>
    }
    else
    {
        <option value="@item.id">@item.name</option>                                                
    }
}*@
 */
