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
    public class BuffetTicketTimeSlotController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/buffet-ticket-time-slot")]
        [HttpGet]
        public Wrapper<IEnumerable<BuffetTicketTimeSlot>> Get()
        {
            var buffetTickets = db.BuffetTicketTimeSlots.OrderByDescending(t => t.BuffetTicketTimeSlotID).ToList();
            var result = new Wrapper<IEnumerable<BuffetTicketTimeSlot>>
            {
                Success = buffetTickets.Any(),
                Message = buffetTickets.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = buffetTickets
            };
            return result;
        }

        [Route("api/buffet-ticket-time-slot/{id}")]
        [HttpGet]
        public Wrapper<BuffetTicketTimeSlot> Get(int id)
        {
            var result = new Wrapper<BuffetTicketTimeSlot>();
            var buffetTicketTimeSlot = db.BuffetTicketTimeSlots.FirstOrDefault(t => t.BuffetTicketTimeSlotID == id);

            if (buffetTicketTimeSlot != null)
            {
                var buffetTicket = db.BuffetTickets.FirstOrDefault(t => t.Active == 1 && t.BuffetTicketID == buffetTicketTimeSlot.BuffetTicketID);
                if (buffetTicket != null)
                {
                    result.Success = true;
                    result.Message = "";
                    result.Data = buffetTicketTimeSlot;
                } else
                {
                    result.Success = false;
                    result.Message = "Không tìm thấy dữ liệu!";
                }
                return result;
            }

            result.Success = false;
            result.Message = "Không tìm thấy dữ liệu!";
            return result;
        }

        [Route("api/buffet-ticket-time-slot")]
        [HttpPost]
        public Wrapper<BuffetTicketTimeSlot> Post([FromBody] BuffetTicketTimeSlot buffetTicketTimeSlot)
        {
            var result = new Wrapper<BuffetTicketTimeSlot>();

            if (buffetTicketTimeSlot.BuffetTicketID == 0)
            {
                result.Success = false;
                result.Message = "Vé Buffet không được để trống!";
                return result;
            }

            if (db.BuffetTickets.FirstOrDefault(t => t.Active == 1 && t.BuffetTicketID == buffetTicketTimeSlot.BuffetTicketID) == null)
            {
                result.Success = false;
                result.Message = "Giá vé Buffet không tồn tại!";
                return result;
            }

            if (buffetTicketTimeSlot.DiscountPrice == 0)
            {
                result.Success = false;
                result.Message = "Giá vé Discount không được để trống!";
                return result;
            }

            if (buffetTicketTimeSlot.StartTime == null)
            {
                result.Success = false;
                result.Message = "Thời gian bắt đầu không được để trống!";
                return result;
            }

            if (buffetTicketTimeSlot.EndTime == null)
            {
                result.Success = false;
                result.Message = "Thời gian kết thúc không được để trống!";
                return result;
            }

            if (db.BuffetTicketTimeSlots.Any(t => t.BuffetTicketID == buffetTicketTimeSlot.BuffetTicketID))
            {
                result.Success = false;
                result.Message = "Vé Buffet đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                buffetTicketTimeSlot.CreatedAt = DateTime.Now;
                buffetTicketTimeSlot.UpdatedAt = DateTime.Now;
                db.BuffetTicketTimeSlots.Add(buffetTicketTimeSlot);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = buffetTicketTimeSlot;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }

        [Route("api/buffet-ticket-time-slot/{id}")]
        [HttpPut]
        public Wrapper<BuffetTicketTimeSlot> Put(int id, [FromBody] BuffetTicketTimeSlot buffetTicketTimeSlot)
        {
            var result = new Wrapper<BuffetTicketTimeSlot>();
            var existingBuffetTicket = db.BuffetTicketTimeSlots.FirstOrDefault(t => t.BuffetTicketTimeSlotID == id);

            if (existingBuffetTicket == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            if (buffetTicketTimeSlot.BuffetTicketID < 0)
            {
                result.Success = false;
                result.Message = "Vé Buffet không được để trống!";
                return result;
            }

            if (db.BuffetTickets.FirstOrDefault(t => t.Active == 1 && t.BuffetTicketID == buffetTicketTimeSlot.BuffetTicketID) == null)
            {
                result.Success = false;
                result.Message = "Giá vé Buffet không tồn tại!";
                return result;
            }

            if (buffetTicketTimeSlot.DiscountPrice < 0)
            {
                result.Success = false;
                result.Message = "Giá vé Discount không được để trống!";
                return result;
            }

            if (db.BuffetTicketTimeSlots.Any(t => t.BuffetTicketID == buffetTicketTimeSlot.BuffetTicketID && t.BuffetTicketTimeSlotID != id))
            {
                result.Success = false;
                result.Message = "Vé Buffet đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                existingBuffetTicket.BuffetTicketID = buffetTicketTimeSlot.BuffetTicketID;
                existingBuffetTicket.DiscountPrice = buffetTicketTimeSlot.DiscountPrice;
                existingBuffetTicket.StartTime = buffetTicketTimeSlot.StartTime;
                existingBuffetTicket.EndTime = buffetTicketTimeSlot.EndTime;
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

        [Route("api/buffet-ticket-time-slot/{id}")]
        [HttpDelete]
        public Wrapper<BuffetTicketTimeSlot> Delete(int id)
        {
            var result = new Wrapper<BuffetTicketTimeSlot>();
            var buffetTicket = db.BuffetTicketTimeSlots.FirstOrDefault(t => t.BuffetTicketID == id);

            if (buffetTicket == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                db.BuffetTicketTimeSlots.Remove(buffetTicket);
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
