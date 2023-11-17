$(document).ready(function () {
    loadData();
    storeServingTable();
    transferServingTable();
    closeServingTable();
});

function loadData() {
    $('#serving-tables').empty();
    $.ajax({
        url: '/api/serving-table',
        method: 'GET',
        success: function (response) {
            if (response.Success) {
                $.each(response.Data, function (index, serving_tables) {
                    var list_serving_table = [];
                    list_serving_table[0] = serving_tables.ServingTableID;
                    list_serving_table[1] = serving_tables.ServingTableCode;
                    list_serving_table[2] = serving_tables.Capacity;

                    if (serving_tables.Status == 0) {
                        servingTable(list_serving_table, "text-white", "bg-danger", "Đang đóng", "Mở bàn phục vụ", "modal-store-serving-table");
                    } else {
                        servingTable(list_serving_table, "text-white", "bg-success", "Đang mở", "Thông tin bàn phục vụ", "modal-info-serving-table");
                    }
                });
            }
        }
    });
    modalServingTable();
    modalInfoServingTable();
}

function servingTable(list_serving_table, text_color, bg_color, status, active, model) {
    $('#serving-tables').append(`
        <div class="col-md-3 mb-3">
            <div class="card ${text_color} ${bg_color}" style="box-shadow: 3px 3px 22px -2px #AAA;">
                <div class="card-body" style="padding: 15px 21px;">
                    <div class="mr-5">
                        <h3 class="${text_color}">Mã bàn: ${list_serving_table[1]}</h3>
                        <p style="margin: 0px; padding: 0px; font-size: 10px;">
                            <b>Sức chứa:</b> <span ${text_color}">${list_serving_table[2]}</span>
                        </p>
                        <p style="margin: 0px; padding: 0px; font-size: 10px;">
                            <b>Trạng thái:</b> <span ${text_color}">${status}</span>
                        </p>
                    </div>
                </div>
                <a class="card-footer ${text_color} ${bg_color} clearfix small z-1" id="serving_table_${list_serving_table[0]}" data-toggle="modal" data-target="#${model}"
                data-serving_table_id="${list_serving_table[0]}" data-serving_table_code="${list_serving_table[1]}" data-capacity="${list_serving_table[2]}"
                style="padding: 15px 21px; border-radius: 0 0 calc(60rem - 1px) calc(60rem - 1px);">
                    <span class="float-left" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">${active}</span>
                    <span class="float-right"><i class="fa fa-angle-right"></i></span>
                </a>
            </div>
        </div>
    `);

    $("#serving_table_" + list_serving_table[0]).click(function () {
        const serving_table = $('#serving_table_' + list_serving_table[0]).data('serving_table_id')
        const serving_table_code = $('#serving_table_' + list_serving_table[0]).data('serving_table_code')
        const capacity = $('#serving_table_' + list_serving_table[0]).data('capacity')
        $("#store-serving-table").val(serving_table);
        $("#store-serving-table-code").val("Mã bàn: " + serving_table_code + " - Sức chứa: " + capacity);
        if (model == "modal-store-serving-table") {
            $("#modal-store-serving-table").modal("show");
            $('#store-errors').empty();
        } else {
            $("#modal-info-serving-table").modal("show");
        }

        $.ajax({
            url: '/api/order',
            method: 'GET',
            success: function (response) {
                if (response.Success) {
                    $.each(response.Data, function (index, orders) {
                        if (list_serving_table[0] == orders.ServingTable.ServingTableID && orders.ServingTable.Status == 1 && orders.Status == 0) {
                            $("#info-order").val(orders.OrderID);
                            $("#info-order-readonly").val("Mã hóa đơn: " + orders.OrderID);
                            $("#info-serving-table-code-readonly").val("Mã bàn hiện tại: " + orders.ServingTable.ServingTableID);
                            $("#info-quantity").val(orders.Quantity);
                            $("#info-buffet-ticket-price-readonly").val(orders.PriceBuffetTicket.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
                            $("#info-discount-price-readonly").val(orders.DiscountPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
                        }
                    });
                }
            }
        });
    });
}

function modalServingTable() {
    $('#modal-store-serving-table').empty();
    $('#modal-store-serving-table').append(`
        <div class="modal-dialog modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">MỞ BÀN PHỤC VỤ</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding-bottom: 3px;">
                    <div class="form-group">
                        <div class="item_opt_wrapper">
                            <div class="row">
                                <div class="col-lg-5 col-md-4">
                                    <div class="form-group">
                                        <label>Mã bàn phục vụ</label>
                                        <input type="hidden" id="store-serving-table" name="serving_table">
                                        <input type="text" id="store-serving-table-code" class="form-control" placeholder="Mã bàn phục vụ" readonly="readonly">
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-8">
                                    <div class="form-group">
                                        <label>Vé Buffet</label>
                                        <div class="styled-select" style="height: 36px;">
                                            <select class="form-select" style="height: 35px;" id="store-buffet-ticket" name="buffet_ticket">
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-12">
                                    <div class="form-group">
                                        <label>Số lượng</label>
                                        <input type="number" id="store-quantity" name="quantity" class="form-control" placeholder="Số lượng">
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12" id="store-errors">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Thoát</button>
                    <button type="button" class="btn btn-success store-serving-table">Mở bàn phục vụ</button>
                </div>
            </div>
        </div>
    `);

    $('#store-buffet-ticket').empty();
    $.ajax({
        url: '/api/buffet-ticket',
        method: 'GET',
        success: function (response) {
            if (response.Success) {
                $.each(response.Data, function (index, buffet_tickets) {
                    $('#store-buffet-ticket').append(`
                        <option value="${buffet_tickets.BuffetTicketID}">${buffet_tickets.Name} - ${buffet_tickets.Price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</option>
                    `);
                });
            }
        }
    });
}

function modalInfoServingTable() {
    $('#modal-info-serving-table').empty();
    $('#modal-info-serving-table').append(`
        <div class="modal-dialog modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">THÔNG TIN BÀN PHỤC VỤ</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding-bottom: 3px;">
                    <div class="form-group">
                        <div class="item_opt_wrapper">
                            <div class="row">
                                <div class="col-lg-6 col-md-6">
                                    <div class="form-group">
                                        <label style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Mã hóa đơn</label>
                                        <input type="hidden" id="info-order" name="order">
                                        <input type="text" id="info-order-readonly" class="form-control" placeholder="Mã hóa đơn" readonly="readonly">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="form-group">
                                        <label style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Mã bàn phục vụ hiện tại</label>
                                        <input type="text" id="info-serving-table-code-readonly" class="form-control" placeholder="Mã bàn phục vụ hiện tại" readonly="readonly">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="form-group">
                                        <label style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Giá Buffet</label>
                                        <input type="text" id="info-buffet-ticket-price-readonly" class="form-control" placeholder="Giá Buffet" readonly="readonly">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="form-group">
                                        <label style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Giá vé khuyến mãi</label>
                                        <input type="text" id="info-discount-price-readonly" class="form-control" placeholder="Giá vé khuyến mãi" readonly="readonly">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="form-group">
                                        <label style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Mã bàn phục vụ cần chuyển</label>
                                        <div class="styled-select" style="height: 36px;">
                                            <select class="form-select" style="height: 35px;" id="info-serving-table" name="serving_table">
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="form-group">
                                        <label style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Số lượng thực khách</label>
                                        <input type="number" id="info-quantity" name="quantity" class="form-control" placeholder="Số lượng thực khách">
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12" id="info-errors">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Thoát</button>
                    <button type="button" class="btn btn-danger close-serving-table">Đóng bàn phục vụ</button>
                    <button type="button" class="btn btn-success transfer-serving-table">Chuyển bàn phục vụ</button>
                </div>
            </div>
        </div>
    `);

    $('#info-serving-table').empty();
    $.ajax({
        url: '/api/serving-table',
        method: 'GET',
        success: function (response) {
            if (response.Success) {
                $('#info-serving-table').append(`
                    <option value="0">Chọn bàn phục vụ cần chuyển</option>
                `);
                $.each(response.Data, function (index, serving_tables) {
                    if (serving_tables.Status == 0) {
                        $('#info-serving-table').append(`
                            <option value="${serving_tables.ServingTableID}">Mã bàn: ${serving_tables.ServingTableCode} - Sức chứa: ${serving_tables.Capacity}</option>
                        `);
                    }
                });
            }
        }
    });
}

function storeServingTable() {
    $('#modal-store-serving-table').on('click', '.store-serving-table', function () {
        let serving_table = $('#store-serving-table').val();
        let buffet_ticket = $('#store-buffet-ticket').val();
        let quantity = $('#store-quantity').val();

        if (!quantity) {
            quantity = 0;
        }

        $.ajax({
            url: '/api/order',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                ServingTableID: serving_table,
                BuffetTicketID: buffet_ticket,
                Quantity: quantity,
            }),
            success: function (response) {
                $('#store-errors').empty();
                if (response.Success) {
                    $('#store-errors').append(`
                        <div class="form-group">
                            <div class="alert alert-success alert-dismissible fade show" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                ${response.Message}
                            </div>
                        </div>
                    `);
                    setTimeout(() => {
                        loadData();
                        $('#modal-store-serving-table').modal('hide');
                    }, 1000);
                } else {
                    $('#store-errors').append(`
                        <div class="form-group">
                            <div class="alert alert-danger alert-dismissible fade show" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                ${response.Message}
                            </div>
                        </div>
                    `);
                }
            },
        });
    });
}

function transferServingTable() {
    $('#modal-info-serving-table').on('click', '.transfer-serving-table', function () {
        const order = $('#info-order').val();
        const serving_table = $('#info-serving-table').val();
        const quantity = $('#info-quantity').val();

        if (serving_table == 0) {
            $('#info-errors').empty();
            $('#info-errors').append(`
                <div class="form-group">
                    <div class="alert alert-danger alert-dismissible fade show" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                        Bàn phục vụ hiện tại không hợp lệ hoặc không tồn tại!
                    </div>
                </div>
            `);
        }

        $.ajax({
            url: '/api/order/transfer',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                "OrderID": order,
                "ServingTableID": serving_table,
                "Quantity": quantity
            }),
            success: function (response) {
                $('#info-errors').empty();
                if (response.Success) {
                    $('#info-errors').append(`
                        <div class="form-group">
                            <div class="alert alert-success alert-dismissible fade show" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                ${response.Message}
                            </div>
                        </div>
                    `);
                    setTimeout(() => {
                        loadData();
                        $('#modal-info-serving-table').modal('hide');
                    }, 1000);
                } else {
                    $('#info-errors').append(`
                        <div class="form-group">
                            <div class="alert alert-danger alert-dismissible fade show" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                 ${response.Message}
                            </div>
                        </div>
                    `);
                }
            },
        });
    })
}

function closeServingTable() {
    console.log(12)
    $('#modal-info-serving-table').on('click', '.close-serving-table', function () {
        const id = $('#info-order').val();
        $.ajax({
            url: '/api/order/close-serving-table/' + id,
            method: 'PUT',
            success: function (response) {
                if (response.Success) {
                    $('#info-errors').append(`
                        <div class="form-group">
                            <div class="alert alert-success alert-dismissible fade show" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                ${response.Message}
                            </div>
                        </div>
                    `);
                    setTimeout(() => {
                        loadData();
                        $('#modal-info-serving-table').modal('hide');
                    }, 1000);
                } else {
                    $('#info-errors').append(`
                        <div class="form-group">
                            <div class="alert alert-dangder alert-dismissible fade show" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                ${response.Message}
                            </div>
                        </div>
                    `);
                }
            }
        });
    })
}
