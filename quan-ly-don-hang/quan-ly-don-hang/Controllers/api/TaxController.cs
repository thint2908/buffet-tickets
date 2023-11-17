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
    public class TaxController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/tax")]
        [HttpGet]
        public Wrapper<IEnumerable<Tax>> Get()
        {
            var taxs = db.Taxes.Where(t => t.Active == 1).OrderByDescending(t => t.TaxID).ToList();
            var result = new Wrapper<IEnumerable<Tax>>
            {
                Success = taxs.Any(),
                Message = taxs.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = taxs
            };
            return result;
        }

        [Route("api/tax/{id}")]
        [HttpGet]
        public Wrapper<Tax> Get(int id)
        {
            var tax = db.Taxes.FirstOrDefault(t => t.Active == 1 && t.TaxID == id);
            var result = new Wrapper<Tax>
            {
                Success = tax != null,
                Message = tax != null ? "" : "Không tìm thấy dữ liệu!",
                Data = tax
            };
            return result;
        }

        [Route("api/tax")]
        [HttpPost]
        public Wrapper<Tax> Post([FromBody] Tax tax)
        {
            var result = new Wrapper<Tax>();

            if (string.IsNullOrEmpty(tax.Name))
            {
                result.Success = false;
                result.Message = "Tên thuế không được để trống!";
                return result;
            }

            if (string.IsNullOrEmpty(tax.Type))
            {
                result.Success = false;
                result.Message = "Thể loại thuế không được để trống!";
                return result;
            }

            if (tax.Value < 0)
            {
                result.Success = false;
                result.Message = "Giá trị thuế không được để trống!";
                return result;
            }

            if (db.Taxes.Any(t => t.Name == tax.Name && t.Active == 1 && t.Value == tax.Value))
            {
                result.Success = false;
                result.Message = "Thuế đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                tax.Active = 1;
                tax.CreatedAt = DateTime.Now;
                tax.UpdatedAt = DateTime.Now;
                db.Taxes.Add(tax);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = tax;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }

        [Route("api/tax/{id}")]
        [HttpPut]
        public Wrapper<Tax> Put(int id, [FromBody] Tax tax)
        {
            var result = new Wrapper<Tax>();
            var existingTax = db.Taxes.FirstOrDefault(t => t.Active == 1 && t.TaxID == id);

            if (existingTax == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            if (string.IsNullOrEmpty(tax.Name))
            {
                result.Success = false;
                result.Message = "Tên thuế không được để trống!";
                return result;
            }

            if (string.IsNullOrEmpty(tax.Type))
            {
                result.Success = false;
                result.Message = "Thể loại thuế không được để trống!";
                return result;
            }

            if (tax.Value < 0)
            {
                result.Success = false;
                result.Message = "Giá trị thuế không được để trống!";
                return result;
            }

            if (db.Taxes.Any(t => t.Name == tax.Name && t.Active == 1 && t.Value == tax.Value && t.TaxID != id))
            {
                result.Success = false;
                result.Message = "Thuế đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                existingTax.Name = tax.Name;
                existingTax.Type = tax.Type;
                existingTax.Value = tax.Value;
                existingTax.UpdatedAt = DateTime.Now;

                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
                result.Data = existingTax;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = existingTax;
            }

            return result;
        }

        [Route("api/tax/{id}")]
        [HttpDelete]
        public Wrapper<Tax> Delete(int id)
        {
            var result = new Wrapper<Tax>();
            var tax = db.Taxes.FirstOrDefault(t => t.Active == 1 && t.TaxID == id);

            if (tax == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                tax.Active = 0;
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
