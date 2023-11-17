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
    public class CategoryFoodController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/category-food")]
        [HttpGet]
        public Wrapper<IEnumerable<CategoryFood>> Get()
        {
            var categoryFoods = db.CategoryFoods.Where(t => t.Active == 1).OrderByDescending(t => t.CategoryFoodID).ToList();
            var result = new Wrapper<IEnumerable<CategoryFood>>
            {
                Success = categoryFoods.Any(),
                Message = categoryFoods.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = categoryFoods
            };
            return result;
        }

        [Route("api/category-food/{id}")]
        [HttpGet]
        public Wrapper<CategoryFood> Get(int id)
        {
            var categoryFood = db.CategoryFoods.FirstOrDefault(t => t.Active == 1 && t.CategoryFoodID == id);
            var result = new Wrapper<CategoryFood>
            {
                Success = categoryFood != null,
                Message = categoryFood != null ? "" : "Không tìm thấy dữ liệu!",
                Data = categoryFood
            };
            return result;
        }

        [Route("api/category-food")]
        [HttpPost]
        public Wrapper<CategoryFood> Post([FromBody] CategoryFood categoryFood)
        {
            var result = new Wrapper<CategoryFood>();

            if (string.IsNullOrEmpty(categoryFood.Name))
            {
                result.Success = false;
                result.Message = "Tên thể loại món ăn không được để trống!";
                return result;
            }

            if (db.CategoryFoods.Any(t => t.Name == categoryFood.Name && t.Active == 1))
            {
                result.Success = false;
                result.Message = "Tên thể loại món ăn đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                categoryFood.Active = 1;
                categoryFood.CreatedAt = DateTime.Now;
                categoryFood.UpdatedAt = DateTime.Now;
                db.CategoryFoods.Add(categoryFood);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = categoryFood;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }

        [Route("api/category-food/{id}")]
        [HttpPut]
        public Wrapper<CategoryFood> Put(int id, [FromBody] CategoryFood categoryFood)
        {
            var result = new Wrapper<CategoryFood>();
            var existingCategory = db.CategoryFoods.FirstOrDefault(t => t.Active == 1 && t.CategoryFoodID == id);

            if (existingCategory == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            if (string.IsNullOrEmpty(categoryFood.Name))
            {
                result.Success = false;
                result.Message = "Thể loại món ăn không được để trống!";
                return result;
            }

            if (db.CategoryFoods.Any(t => t.Name == categoryFood.Name && t.Active == 1 && t.CategoryFoodID != id))
            {
                result.Success = false;
                result.Message = "Thể loại món ăn đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                existingCategory.Name = categoryFood.Name;
                existingCategory.Description = categoryFood.Description;
                existingCategory.UpdatedAt = DateTime.Now;

                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
                result.Data = existingCategory;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = existingCategory;
            }

            return result;
        }

        [Route("api/category-food/{id}")]
        [HttpDelete]
        public Wrapper<CategoryFood> Delete(int id)
        {
            var result = new Wrapper<CategoryFood>();
            var categoryFood = db.CategoryFoods.FirstOrDefault(t => t.Active == 1 && t.CategoryFoodID == id);

            if (categoryFood == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                categoryFood.Active = 0;
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
