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
    public class BuffetTicketMenuItemController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/buffet-ticket-menu-item")]
        [HttpGet]
        public Wrapper<IEnumerable<BuffetTicketMenuItem>> Get()
        {
            var buffetTicketMenuItems = db.BuffetTicketMenuItems.OrderByDescending(t => t.BuffetTicketMenuItemID).ToList();
            var result = new Wrapper<IEnumerable<BuffetTicketMenuItem>>
            {
                Success = buffetTicketMenuItems.Any(),
                Message = buffetTicketMenuItems.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = buffetTicketMenuItems
            };
            return result;
        }

        [Route("api/buffet-ticket-menu-item/{id}")]
        [HttpGet]
        public Wrapper<BuffetTicketMenuItem> Get(int id)
        {
            var buffetTicketMenuItem = db.BuffetTicketMenuItems.FirstOrDefault(t => t.BuffetTicketMenuItemID == id);
            var result = new Wrapper<BuffetTicketMenuItem>
            {
                Success = buffetTicketMenuItem != null,
                Message = buffetTicketMenuItem != null ? "" : "Không tìm thấy dữ liệu!",
                Data = buffetTicketMenuItem
            };
            return result;
        }

        [Route("api/buffet-ticket-menu-item")]
        [HttpPost]
        public Wrapper<BuffetTicketMenuItem> Post([FromBody] BuffetTicketMenuItem buffetTicketMenuItem)
        {
            var result = new Wrapper<BuffetTicketMenuItem>();

            if (buffetTicketMenuItem.BuffetTicketID <= 0)
            {
                result.Success = false;
                result.Message = "Vé Buffet không được để trống!";
                return result;
            }

            if (buffetTicketMenuItem.MenuItemID <= 0)
            {
                result.Success = false;
                result.Message = "Món ăn không được để trống!";
                return result;
            }

            if (
                db.BuffetTicketMenuItems.FirstOrDefault(t => t.BuffetTicketID == buffetTicketMenuItem.BuffetTicketID && t.MenuItemID == buffetTicketMenuItem.MenuItemID) != null
            )
            {
                result.Success = false;
                result.Message = "Món ăn đã tồn tại trong vé Buffet bạn vừa chọn!";
                return result;
            }

            try
            {
                db.BuffetTicketMenuItems.Add(buffetTicketMenuItem);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = buffetTicketMenuItem;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }

        [Route("api/buffet-ticket-menu-item/{id}")]
        [HttpPut]
        public Wrapper<BuffetTicketMenuItem> Put(int id, [FromBody] BuffetTicketMenuItem buffetTicketMenuItem)
        {
            var result = new Wrapper<BuffetTicketMenuItem>();
            var existingBuffetTicketMenuItem = db.BuffetTicketMenuItems.FirstOrDefault(t => t.BuffetTicketMenuItemID == id);

            if (existingBuffetTicketMenuItem == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            if (buffetTicketMenuItem.BuffetTicketID <= 0)
            {
                result.Success = false;
                result.Message = "Vé Buffet không được để trống!";
                return result;
            }

            if (buffetTicketMenuItem.MenuItemID <= 0)
            {
                result.Success = false;
                result.Message = "Món ăn không được để trống!";
                return result;
            }

            if (
                db.BuffetTicketMenuItems.Any(t => t.BuffetTicketID == buffetTicketMenuItem.BuffetTicketID && t.MenuItemID == buffetTicketMenuItem.MenuItemID && t.BuffetTicketMenuItemID != id)
            )
            {
                result.Success = false;
                result.Message = "Món ăn đã tồn tại trong vé Buffet bạn vừa chọn!";
                return result;
            }

            try
            {
                existingBuffetTicketMenuItem.BuffetTicketID = buffetTicketMenuItem.BuffetTicketID;
                existingBuffetTicketMenuItem.MenuItemID = buffetTicketMenuItem.MenuItemID;

                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
                result.Data = existingBuffetTicketMenuItem;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = existingBuffetTicketMenuItem;
            }

            return result;
        }

        [Route("api/buffet-ticket-menu-item/{id}")]
        [HttpDelete]
        public Wrapper<BuffetTicketMenuItem> Delete(int id)
        {
            var result = new Wrapper<BuffetTicketMenuItem>();
            var buffetTicketMenuItem = db.BuffetTicketMenuItems.FirstOrDefault(t => t.BuffetTicketMenuItemID == id);

            if (buffetTicketMenuItem == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!"; 
                return result;
            }

            try
            {
                db.BuffetTicketMenuItems.Remove(buffetTicketMenuItem);
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