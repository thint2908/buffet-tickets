$(document).ready(function () {
    loadData();
    paymentConfirmation();
});

function loadData() {
    const currentUrl = window.location.href;
    const segments = currentUrl.split("/");
    const order_id = segments[segments.length - 1];

    $('#payment-details').empty();
    $.ajax({
        url: '/api/payment/' + order_id,
        method: 'GET',
        success: function (response) {
            if (response.Success) {
                console.log(response.Data);
                const payment = response.Data;
                $('#payment-details').append(`
                    <div class="header_box">
                        <h2>MÃ HÓA ĐƠN: ${payment.Order.OrderID}</h2>
                    </div>
                    <div class="list_general order">
                        <ul>
                            <li><strong>Mã bàn phục vụ:</strong> ${payment.Order.ServingTable.ServingTableCode}</li>
                            <li><strong>Loại vé:</strong> ${payment.Order.BuffetTicket.Name}</li>
                            <li><strong>Số lượng khách:</strong> ${payment.Order.Quantity}</li>
                            <li><strong>Giá vé:</strong> ${payment.Order.PriceBuffetTicket.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</li>
                            <li><strong>Giá giảm:</strong> ${payment.Order.DiscountPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</li>
                        </ul>
                    </div>
                    <hr>
                    <h5 style="padding-bottom: 15px;">Danh Sách Đơn Hàng</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0" style="padding-left: 0px; padding-right: 0px;">
                            <thead>
                                <tr>
                                    <th>Tên Món Ăn</th>
                                    <th>Ghi Chú</th>
                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>Tên Món Ăn</th>
                                    <th>Ghi Chú</th>
                                    <th>Số lượng</th>
                                </tr>
                            </tfoot>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                    <div class="row justify-content-end total_order">
                        <div class="col-xl-8 col-lg-8 col-md-8">
                            <a class="btn btn-default btn-md" href="/Manager/Payment">Quay lại</a>
                        </div>
                        <div class="col-xl-4 col-lg-4 col-md-4" id="checktout">
                            <ul>
                                <li>
                                    <span><b>Giá vé:</b></span> ${payment.TotalPriceBuffetTicket.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </li>
                                <li>
                                    <span><b>Giá giảm:</b></span> ${payment.TotalDiscountPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </li>
                                <li>
                                    <span><b>Phí dịch vụ:</b></span> ${payment.TotalValueTax.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </li>
                                <li>
                                    <hr>
                                    <span><b>TỔNG TIỀN:</b></span> ${payment.TotalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </li>
                            </ul>
                        </div>
                    </div>
                `);
                if (payment.Status == 0) {
                    $('#checktout').append(`
                        <a class="btn btn-primary btn-md btn-serving-table-refresh" id="payment-confirmation" data-payment_id="${payment.PaymentID}" class="btn_1 full-width cart" style="width: 100%; text-align: center;">Thanh toán</a>
                    `);
                }
            }
        }
    });
}

function paymentConfirmation() {
    $('#payment-details').on('click', '#payment-confirmation', function () {
        const payment_id = $('#payment-confirmation').data('payment_id');
        $.ajax({
            url: '/api/payment/confirmation/' + payment_id,
            method: 'PUT',
            success: function (response) {
                if (response.Success) {
                    alert(response.Message);
                    window.location.replace("/Manager/Payment/Details/" + payment_id);
                } else {
                    alert(response.Message);
                }
            }
        });
    })
}