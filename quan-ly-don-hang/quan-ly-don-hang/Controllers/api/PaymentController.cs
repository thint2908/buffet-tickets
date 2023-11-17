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
    public class PaymentController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/payment")]
        [HttpGet]
        public Wrapper<IEnumerable<Payment>> Get()
        {
            var payments = db.Payments.OrderBy(t => t.Status).ToList();
            var result = new Wrapper<IEnumerable<Payment>>
            {
                Success = payments.Any(),
                Message = payments.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = payments
            };
            return result;
        }

        [Route("api/payment/{id}")]
        [HttpGet]
        public Wrapper<Payment> Get(int id)
        {
            var payment = db.Payments.FirstOrDefault(t => t.PaymentID == id);
            var result = new Wrapper<Payment>
            {
                Success = payment != null,
                Message = payment != null ? "" : "Không tìm thấy dữ liệu!",
                Data = payment
            };
            return result;
        }

        [Route("api/payment/confirmation/{id}")]
        [HttpPut]
        public Wrapper<Order> PaymentConfirmation(int id)
        {
            var result = new Wrapper<Order>();
            var existingPayment = db.Payments.FirstOrDefault(t => t.PaymentID == id);

            if (existingPayment == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                existingPayment.Status = 1;
                existingPayment.UpdatedAt = DateTime.Now;
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
