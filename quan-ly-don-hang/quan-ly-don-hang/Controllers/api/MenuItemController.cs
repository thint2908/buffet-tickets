

using quan_ly_don_hang.Context;
using quan_ly_don_hang.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;



namespace quan_ly_don_hang.Controllers.api
{
    public class MenuItemController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/menu-item")]
        [HttpGet]
        public Wrapper<IEnumerable<MenuItem>> Get()
        {
            var menuItems = db.MenuItems.Where(t => t.Active == 1 && t.CategoryFood.Active == 1).OrderByDescending(t => t.CategoryFoodID).ToList();

            var result = new Wrapper<IEnumerable<MenuItem>>
            {
                Success = menuItems.Any(),
                Message = menuItems.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = menuItems
            };
            return result;
        }

        [Route("api/menu-item/{id}")]
        [HttpGet]
        public Wrapper<MenuItem> Get(int id)
        {
            var menuItem = db.MenuItems.FirstOrDefault(t => t.Active == 1 && t.MenuItemID == id && t.CategoryFood.Active == 1);
            var result = new Wrapper<MenuItem>
            {
                Success = menuItem != null,
                Message = menuItem != null ? "" : "Không tìm thấy dữ liệu!",
                Data = menuItem
            };
            return result;
        }

        /*[Route("api/menu-item")]
        [HttpPost]
        public Wrapper<MenuItem> Post([FromBody] MenuItem menuItem)
        {
            var result = new Wrapper<MenuItem>();

            if (string.IsNullOrEmpty(menuItem.Name))
            {
                result.Success = false;
                result.Message = "Tên món ăn không được để trống!";
                return result;
            }

            if (db.MenuItems.Any(t => t.Name == menuItem.Name && t.Active == 1))
            {
                result.Success = false;
                result.Message = "Tên món ăn đã tồn tại trong hệ thống!";
                return result;
            }
            return null;
        }*/

        /*Handle add item*/
        [Route("api/menu-item")]
        [HttpPost]
        public Wrapper<MenuItem> AddItem()
        {
            var result = new Wrapper<MenuItem>();
            try
            {
                // Lấy thông tin của yêu cầu hiện tại
                var httpRequest = HttpContext.Current.Request;
                // Lấy dữ liệu từ form-data

                var name = httpRequest.Form["Name"];
                var cateFoodID = Int64.Parse(httpRequest.Form["CategoryFoodID"]);
                var desc = httpRequest.Form["Description"];
                var price = Int64.Parse(httpRequest.Form["Price"]);
                var status = Int64.Parse(httpRequest.Form["Status"]);
                var active = Int64.Parse(httpRequest.Form["Active"]);


                if (string.IsNullOrEmpty(name))
                {
                    result.Success = false;
                    result.Message = "Tên món ăn không được bỏ trống";
                    return result;
                }
                if(db.MenuItems.Any(t => t.Name == name && t.Active == 1))
                {
                    result.Success = false;
                    result.Message = "Món ăn đã tồn tại trong hệ thống!";
                    return result;
                }
                var existingMenuItem = db.MenuItems.FirstOrDefault(t => t.Name == name && t.Active == 0);
                if (existingMenuItem != null)
                {
                    existingMenuItem.Active = 1;
                    db.SaveChanges();

                    result.Success = true;
                    result.Message = "Thêm dữ liệu thành công!";
                    result.Data= existingMenuItem;
                    return result;
                }


                // Lấy file từ form-data
                var file = httpRequest.Files["ImageUpload"];
                var fileName = DateTime.Now.Ticks.ToString() + "_" + file.FileName;

                // Lưu file vào thư mục "~Areas/Uploads/img"
                var path = HttpContext.Current.Server.MapPath("~/Uploads/img/" + fileName);
                file.SaveAs(path);

                // Lưu đường dẫn của file vào biến
                var imgPath = fileName;

                // Tạo đối tượng MenuItem mới
                var menuItem = new MenuItem
                {
                    Name = name,
                    Description = desc,
                    Image = imgPath,
                    Price = (int)price,
                    CategoryFoodID = (int)cateFoodID,
                    Status = (int)status,
                    Active = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };


                // Thêm menuItem vào result
                result.Data = menuItem;
                result.Success = true;
                result.Message= "Thêm dữ liệu thành công!";
                db.MenuItems.Add(menuItem);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                result.Message = ex.Message + " lỗi ở catch trong api" + ex.StackTrace;
            }

            return result;
        }

        /*End handle add item*/

        [Route("api/menu-item/{id}")]
        [HttpPut]
        public Wrapper<MenuItem> Put(int id)
        {
            var result = new Wrapper<MenuItem>();
            var existingMenuItem = db.MenuItems.FirstOrDefault(t => t.Active ==1 && t.MenuItemID== id);
            var imgPath = "";

            var httpRequest = HttpContext.Current.Request;

            var name = httpRequest.Form["Name"];
            var cateFoodID = Int64.Parse(httpRequest.Form["CategoryFoodID"]);
            var desc = httpRequest.Form["Description"];
            var price = Int64.Parse(httpRequest.Form["Price"]);
            var status = Int64.Parse(httpRequest.Form["Status"]);
            var active = Int64.Parse(httpRequest.Form["Active"]);

            if (existingMenuItem == null)
            {
                result.Success= false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }
            if (string.IsNullOrEmpty(name))
            {
                result.Success = false;
                result.Message = "Tên món ăn không được bỏ trống";
                return result;
            }
            if(db.MenuItems.Any(t => t.Name == name && t.Active == 1 && t.MenuItemID != id))
            {
                result.Success = false;
                result.Message = "Món ăn đã tồn tại trong hệ thống!";
                return result;
            }
            // Lấy file từ form-data
            var file = httpRequest.Files["ImageUpload"];
            if(file != null)
            {
                var fileName = DateTime.Now.Ticks.ToString() + "_" + file.FileName;
                var path = HttpContext.Current.Server.MapPath("~/Uploads/img/" + fileName);
                // Lưu đường dẫn của file vào biến
                imgPath = fileName;
                file.SaveAs(path);
            }

            try
            {
                existingMenuItem.Name = name;
                existingMenuItem.CategoryFoodID = (int)cateFoodID;
                existingMenuItem.Description = desc;
                existingMenuItem.Price = (int)price;
                existingMenuItem.Status = (int)status;
                existingMenuItem.UpdatedAt= DateTime.Now;

                if(file != null)
                {
                    existingMenuItem.Image= imgPath;
                }

                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
                result.Data = existingMenuItem;

            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = existingMenuItem;
            }

            return result;
        }

        [Route("api/menu-item/{id}")]
        [HttpDelete]
        public Wrapper<MenuItem> Delete(int id)
        {
            var result = new Wrapper<MenuItem>();
            var menuItem = db.MenuItems.FirstOrDefault(t => t.Active == 1 && t.MenuItemID == id);

            if (menuItem == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                menuItem.Active = 0;
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
