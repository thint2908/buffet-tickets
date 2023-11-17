$(document).ready(function () {
    loadDataPayment();

    $(".btn-payment-refresh").on("click", function () {
        loadDataPayment();
    });
});

function loadDataPayment() {
    if ($.fn.DataTable.isDataTable("#dataTable")) {
        $("#dataTable").DataTable().destroy();
    }

    $('#payments').empty();
    $.ajax({
        url: '/api/payment',
        method: 'GET',
        success: function (response) {
            if (response.Success) {
                $.each(response.Data, function (index, payments) {
                    if (payments.Status == 0) {
                        $('#payments').append(`
                            <tr>
                                <td>${++index}</td>
                                <td>${payments.Order.OrderID}</td>
                                <td><a href="./Payment/Details/${payments.PaymentID}">${payments.Order.ServingTable.ServingTableCode}</a></td>
                                <td>${payments.Order.BuffetTicket.Name}</td>
                                <td>${payments.TotalPriceBuffetTicket.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                <td>${payments.TotalDiscountPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                <td style="color: red;"><b>Chưa thanh toán</b></td>
                            </tr>
                        `);
                    } else {
                        $('#payments').append(`
                            <tr>
                                <td>${++index}</td>
                                <td>${payments.Order.OrderID}</td>
                                <td><a href="./Payment/Details/${payments.PaymentID}">${payments.Order.ServingTable.ServingTableCode}</a></td>
                                <td>${payments.Order.BuffetTicket.Name}</td>
                                <td>${payments.TotalPriceBuffetTicket.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                <td>${payments.TotalDiscountPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                <td style="color: green;"><b>Đã thanh toán</b></td>
                            </tr>
                        `);
                    }
                });
                $("#dataTable").DataTable({
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
        }
    });
}