using quan_ly_don_hang.Context;
using quan_ly_don_hang.Dto;
using quan_ly_don_hang.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace quan_ly_don_hang.Controllers.api
{
    public class OrderController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/order")]
        [HttpGet]
        public Wrapper<IEnumerable<Order>> Get()
        {
            var orders = db.Orders.ToList();

            var result = new Wrapper<IEnumerable<Order>>
            {
                Success = orders.Any(),
                Message = orders.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = orders
            };
            return result;
        }

        [Route("api/order/{id}")]
        [HttpGet]
        public Wrapper<Order> Get(int id)
        {
            var order = db.Orders.FirstOrDefault(t => t.OrderID == id);
            var result = new Wrapper<Order>
            {
                Success = order != null,
                Message = order != null ? "" : "Không tìm thấy dữ liệu!",
                Data = order
            };
            return result;
        }

        [Route("api/order")]
        [HttpPost]
        public Wrapper<Order> Post([FromBody] Order order)
        {
            var result = new Wrapper<Order>();

            var buffetTicket = db.BuffetTickets.FirstOrDefault(t => t.BuffetTicketID == order.BuffetTicketID);
            if (buffetTicket == null || buffetTicket.Active == 0)
            {
                result.Success = false;
                result.Message = "Vé Buffet không hợp lệ hoặc đã hết hạn sử dụng!";
                return result;
            }

            if (order.ServingTableID <= 0)
            {
                result.Success = false;
                result.Message = "Bàn phục vụ không được để trống!";
                return result;
            }

            var servingTable = db.ServingTables.FirstOrDefault(t => t.ServingTableID == order.ServingTableID);
            if (servingTable == null || servingTable.Active != 1 || servingTable.Status != 0)
            {
                result.Success = false;
                result.Message = "Bàn phục vụ không hợp lệ hoặc đang hoạt động!";
                return result;
            }

            if (order.Quantity <= 0)
            {
                result.Success = false;
                result.Message = "Số lượng thực khách phải lớn hơn 0!";
                return result;
            }

            if (order.Quantity > servingTable.Capacity)
            {
                result.Success = false;
                result.Message = "Số lượng thực khách đã vượt quá số lượng bàn cho phép, số lượng bàn cho phép " + servingTable.Capacity + "!";
                return result;
            }

            try
            {
                var buffetTicketTimeSlot = db.BuffetTicketTimeSlots.FirstOrDefault(t => t.BuffetTicketID == buffetTicket.BuffetTicketID);
                Order orderCreate = new Order();
                orderCreate.ServingTableID = servingTable.ServingTableID;
                orderCreate.BuffetTicketID = buffetTicket.BuffetTicketID;
                orderCreate.EmployeeID = 1;
                orderCreate.PriceBuffetTicket = buffetTicket.Price;
                orderCreate.Quantity = order.Quantity;

                if (buffetTicketTimeSlot != null && (DateTime.Now.TimeOfDay >= buffetTicketTimeSlot.StartTime && DateTime.Now.TimeOfDay <= buffetTicketTimeSlot.EndTime))
                {
                    orderCreate.DiscountPrice = buffetTicketTimeSlot.DiscountPrice;
                }
                else
                {
                    orderCreate.DiscountPrice = 0;
                }

                servingTable.Status = 1;
                servingTable.UpdatedAt = DateTime.Now;
                db.SaveChanges();

                orderCreate.CreatedAt = DateTime.Now;
                orderCreate.UpdatedAt = DateTime.Now;
                db.Orders.Add(orderCreate);
                db.SaveChanges();

                OrderTax orderTax = new OrderTax();
                orderTax.OrderID = orderCreate.OrderID;
                orderTax.Tax = "[]";
                orderTax.TotalValueTax = 0;
                orderTax.CreatedAt = DateTime.Now;
                orderTax.UpdatedAt = DateTime.Now;
                db.OrderTaxes.Add(orderTax);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = orderCreate;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }

        [Route("api/order/close-serving-table/{id}")]
        [HttpPut]
        public Wrapper<Order> CloseServingTable(int id)
        {
            var result = new Wrapper<Order>();
            var existingOrder = db.Orders.FirstOrDefault(t => t.OrderID == id);

            if (existingOrder == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                existingOrder.Status = 1;
                existingOrder.UpdatedAt = DateTime.Now;
                db.SaveChanges();

                ServingTable servingTable = existingOrder.ServingTable;
                servingTable.Status = 0;
                servingTable.UpdatedAt = DateTime.Now;
                db.SaveChanges();

                Payment payment = new Payment();
                payment.EmployeeID = 1;
                payment.OrderID = id;
                OrderTax orderTax = db.OrderTaxes.FirstOrDefault(t => t.OrderID == id);
                payment.OrderTaxID = orderTax.OrderTaxID;

                DateTime time_now = DateTime.Now;
                List<Shift> shifts = db.Shifts.ToList();
                foreach (Shift shift in shifts)
                {
                    TimeSpan startTime = TimeSpan.Parse(shift.StartTime.ToString()); // Chuyển đổi StartTime thành TimeSpan
                    TimeSpan endTime = TimeSpan.Parse(shift.EndTime.ToString()); // Chuyển đổi EndTime thành TimeSpan
                    TimeSpan currentTime = time_now.TimeOfDay; // Lấy phần TimeSpan của DateTime hiện tại

                    if (currentTime >= startTime && currentTime <= endTime)
                    {
                        payment.ShiftID = shift.ShiftID;
                        break;
                    }
                    payment.ShiftID = shift.ShiftID;
                }

                int total_price_buffet_ticket = existingOrder.PriceBuffetTicket * existingOrder.Quantity;
                int total_discount_price = existingOrder.DiscountPrice;
                int total_value_tax = orderTax.TotalValueTax;
                int total_amount = total_price_buffet_ticket - (total_price_buffet_ticket - total_discount_price) * (total_value_tax / 100);

                payment.TotalPriceBuffetTicket = total_price_buffet_ticket;
                payment.TotalDiscountPrice = total_discount_price;
                payment.TotalValueTax = total_value_tax;
                payment.TotalAmount = total_amount;
                payment.Status = 0;

                payment.CreatedAt = DateTime.Now;
                payment.UpdatedAt = DateTime.Now;

                db.Payments.Add(payment);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
            }

            return result;
        }

        [Route("api/order/transfer")]
        [HttpPost]
        public Wrapper<Order> Transfer([FromBody] TransferServingTableDto transferServingTableDto)
        {
            var result = new Wrapper<Order>();

            var order = db.Orders.FirstOrDefault(t => t.OrderID == transferServingTableDto.OrderID);
            var fromTable = order.ServingTable;
            var toTable = db.ServingTables.FirstOrDefault(t => t.ServingTableID == transferServingTableDto.ServingTableID);

            if (transferServingTableDto.OrderID <= 0)
            {
                result.Success = false;
                result.Message = "Vui lòng không bỏ trống mã hóa đơn!";
                return result;
            }
            if (transferServingTableDto.ServingTableID <= 0)
            {
                result.Success = false;
                result.Message = "Vui lòng không bỏ trống bàn phục vụ cần chuyển!";
                return result;
            }
            if (transferServingTableDto.Quantity <= 0)
            {
                result.Success = false;
                result.Message = "Số lượng thực khách không hợp lệ!";
                return result;
            }
            if (order == null)
            {
                result.Success = false;
                result.Message = "Mã hóa đơn không hợp lệ!";
                return result;
            }
            if (toTable == null && toTable.Status == 1)
            {
                result.Success = false;
                result.Message = "Mã bàn cần chuyển không hợp lệ!";
                return result;
            }
            if (transferServingTableDto.Quantity > toTable.Capacity)
            {
                result.Success = false;
                result.Message = "Số lượng thực khách không vượt quá " + toTable.Capacity + "!";
                return result;
            }

            try
            {
                fromTable.Status = 0;
                db.SaveChanges();

                toTable.Status = 1;
                db.SaveChanges();

                order.ServingTable = toTable;
                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
            }

            return result;
        }
    }
}
