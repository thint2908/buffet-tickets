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
    public class BuffetTicketController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/buffet-ticket")]
        [HttpGet]
        public Wrapper<IEnumerable<BuffetTicket>> Get()
        {
            var buffetTickets = db.BuffetTickets.Where(t => t.Active == 1).OrderByDescending(t => t.BuffetTicketID).ToList();
            var result = new Wrapper<IEnumerable<BuffetTicket>>
            {
                Success = buffetTickets.Any(),
                Message = buffetTickets.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = buffetTickets
            };
            return result;
        }

        [Route("api/buffet-ticket/{id}")]
        [HttpGet]
        public Wrapper<BuffetTicket> Get(int id)
        {
            var buffetTicket = db.BuffetTickets.FirstOrDefault(t => t.Active == 1 && t.BuffetTicketID == id);
            var result = new Wrapper<BuffetTicket>
            {
                Success = buffetTicket != null,
                Message = buffetTicket != null ? "" : "Không tìm thấy dữ liệu!",
                Data = buffetTicket
            };
            return result;
        }

        [Route("api/buffet-ticket")]
        [HttpPost]
        public Wrapper<BuffetTicket> Post([FromBody] BuffetTicket buffetTicket)
        {
            var result = new Wrapper<BuffetTicket>();

            if (string.IsNullOrEmpty(buffetTicket.Name))
            {
                result.Success = false;
                result.Message = "Vé Buffet không được để trống!";
                return result;
            }

            if (buffetTicket.Price < 0)
            {
                result.Success = false;
                result.Message = "Giá vé Buffet không được để trống!";
                return result;
            }

            if (db.BuffetTickets.Any(t => t.Name == buffetTicket.Name && t.Active == 1))
            {
                result.Success = false;
                result.Message = "Vé Buffet đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                buffetTicket.Active = 1;
                buffetTicket.CreatedAt = DateTime.Now;
                buffetTicket.UpdatedAt = DateTime.Now;

                db.BuffetTickets.Add(buffetTicket);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = buffetTicket;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }

        [Route("api/buffet-ticket/{id}")]
        [HttpPut]
        public Wrapper<BuffetTicket> Put(int id, [FromBody] BuffetTicket buffetTicket)
        {
            var result = new Wrapper<BuffetTicket>();
            var existingBuffetTicket = db.BuffetTickets.FirstOrDefault(t => t.Active == 1 && t.BuffetTicketID == id);

            if (existingBuffetTicket == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            if (string.IsNullOrEmpty(buffetTicket.Name))
            {
                result.Success = false;
                result.Message = "Vé Buffet không được để trống!";
                return result;
            }

            if (buffetTicket.Price < 0)
            {
                result.Success = false;
                result.Message = "Giá vé Buffet không được để trống!";
                return result;
            }

            if (db.BuffetTickets.Any(t => t.Name == buffetTicket.Name && t.Active == 1 && t.BuffetTicketID != id))
            {
                result.Success = false;
                result.Message = "Vé Buffet đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                existingBuffetTicket.Name = buffetTicket.Name;
                existingBuffetTicket.Price = buffetTicket.Price;
                existingBuffetTicket.UpdatedAt = DateTime.Now;

                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
                result.Data = existingBuffetTicket;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = existingBuffetTicket;
            }

            return result;
        }

        [Route("api/buffet-ticket/{id}")]
        [HttpDelete]
        public Wrapper<BuffetTicket> Delete(int id)
        {
            var result = new Wrapper<BuffetTicket>();
            var buffetTicket = db.BuffetTickets.FirstOrDefault(t => t.Active == 1 && t.BuffetTicketID == id);

            if (buffetTicket == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                buffetTicket.Active = 0;
                db.SaveChanges();

                result.Success = true;
                result.Message = "Xóa dữ liệu thành công!";
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Xóa dữ liệu không thành công! Lỗi: " + ex.Message;
                return result;
            }
        }
    }
}
