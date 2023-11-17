using quan_ly_don_hang.Context;
using quan_ly_don_hang.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace quan_ly_don_hang.Controllers.api
{
    public class OrderItemController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/order-item")]
        [HttpGet]
        public Wrapper<IEnumerable<OrderItem>> Get()
        {
            var orderItems = db.OrderItems.ToList();

            var result = new Wrapper<IEnumerable<OrderItem>>
            {
                Success = orderItems.Any(),
                Message = orderItems.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = orderItems
            };
            return result;
        }

        [Route("api/order-item/{id}")]
        [HttpGet]
        public Wrapper<OrderItem> Get(int id)
        {
            var orderItem = db.OrderItems.FirstOrDefault(t => t.OrderItemID == id);
            var result = new Wrapper<OrderItem>
            {
                Success = orderItem != null,
                Message = orderItem != null ? "" : "Không tìm thấy dữ liệu!",
                Data = orderItem
            };
            return result;
        }

        [Route("api/order-item")]
        [HttpPost]
        public Wrapper<OrderItem> Post([FromBody] OrderItem orderItem)
        {
            var result = new Wrapper<OrderItem>();

            if (orderItem.OrderID <= 0)
            {
                result.Success = false;
                result.Message = "Hóa đơn không được để trống!";
                return result;
            }

            var order = db.Orders.FirstOrDefault(t => t.OrderID == orderItem.OrderID);
            if (order == null)
            {
                result.Success = false;
                result.Message = "Hóa đơn không tồn tại trong hệ thống!";
                return result;
            }

            if (string.IsNullOrEmpty(orderItem.Cart))
            {
                result.Success = false;
                result.Message = "Danh mục đồ ăn không được bỏ trống";
                return result;
            }

            try
            {
                orderItem.Status = 0;
                orderItem.CreatedAt = DateTime.Now;
                orderItem.UpdatedAt = DateTime.Now;
                db.OrderItems.Add(orderItem);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = orderItem;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }
    }
}
