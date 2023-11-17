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
    public class ShiftController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/shift")]
        [HttpGet]
        public Wrapper<IEnumerable<Shift>> Get()
        {
            var shifts = db.Shifts.Where(t => t.Active == 1).OrderByDescending(t => t.ShiftID).ToList();
            var result = new Wrapper<IEnumerable<Shift>>
            {
                Success = shifts.Any(),
                Message = shifts.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = shifts
            };
            return result;
        }

        [Route("api/shift/{id}")]
        [HttpGet]
        public Wrapper<Shift> Get(int id)
        {
            var shift = db.Shifts.FirstOrDefault(t => t.Active == 1 && t.ShiftID == id);
            var result = new Wrapper<Shift>
            {
                Success = shift != null,
                Message = shift != null ? "" : "Không tìm thấy dữ liệu!",
                Data = shift
            };
            return result;
        }

        [Route("api/shift")]
        [HttpPost]
        public Wrapper<Shift> Post([FromBody] Shift shift)
        {
            var result = new Wrapper<Shift>();

            if (string.IsNullOrEmpty(shift.Name))
            {
                result.Success = false;
                result.Message = "Tên ca trực không được để trống!";
                return result;
            }

            if (shift.StartTime == null)
            {
                result.Success = false;
                result.Message = "Thời gian bắt đầu ca trực không được để trống!";
                return result;
            }

            if (shift.EndTime == null)
            {
                result.Success = false;
                result.Message = "Thời gian kết thúc ca trực không được để trống!";
                return result;
            }

            if (db.Shifts.Any(t => t.Name == shift.Name && t.StartTime == shift.StartTime && t.EndTime == shift.EndTime))
            {
                result.Success = false;
                result.Message = "Ca trực đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                shift.Active = 1;
                db.Shifts.Add(shift);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = shift;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }

        [Route("api/shift/{id}")]
        [HttpPut]
        public Wrapper<Shift> Put(int id, [FromBody] Shift shift)
        {
            var result = new Wrapper<Shift>();
            var existingShift = db.Shifts.FirstOrDefault(t => t.Active == 1 && t.ShiftID == id);

            if (existingShift == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            if (string.IsNullOrEmpty(shift.Name))
            {
                result.Success = false;
                result.Message = "Tên ca trực không được để trống!";
                return result;
            }

            if (shift.StartTime == null)
            {
                result.Success = false;
                result.Message = "Thời gian bắt đầu ca trực không được để trống!";
                return result;
            }

            if (shift.EndTime == null)
            {
                result.Success = false;
                result.Message = "Thời gian kết thúc ca trực không được để trống!";
                return result;
            }

            if (db.Shifts.Any(t => t.Name == shift.Name && t.StartTime == shift.StartTime && t.EndTime == shift.EndTime && t.ShiftID != id))
            {
                result.Success = false;
                result.Message = "Ca trực đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                existingShift.Name = shift.Name;
                existingShift.StartTime = shift.StartTime;
                existingShift.EndTime = shift.EndTime;

                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
                result.Data = existingShift;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = existingShift;
            }

            return result;
        }

        [Route("api/shift/{id}")]
        [HttpDelete]
        public Wrapper<Shift> Delete(int id)
        {
            var result = new Wrapper<Shift>();
            var shift = db.Shifts.FirstOrDefault(t => t.Active == 1 && t.ShiftID == id);

            if (shift == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                shift.Active = 0;
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
