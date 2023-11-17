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
    public class EmployeeController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/employee")]
        [HttpGet]
        public Wrapper<IEnumerable<Employee>> Get()
        {
            var employees = db.Employees.Where(t => t.Active == 1).OrderByDescending(t => t.EmployeeID).ToList();

            var result = new Wrapper<IEnumerable<Employee>>
            {
                Success = employees.Any(),
                Message = employees.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = employees
            };
            return result;
        }

        [Route("api/employee/{id}")]
        [HttpGet]
        public Wrapper<Employee> Get(int id)
        {
            var employee = db.Employees.FirstOrDefault(t => t.Active == 1 && t.EmployeeID == id);
            var result = new Wrapper<Employee>
            {
                Success = employee != null,
                Message = employee != null ? "" : "Không tìm thấy dữ liệu!",
                Data = employee
            };
            return result;
        }

        [Route("api/employee")]
        [HttpPost]
        public Wrapper<Employee> Post([FromBody] Employee employee)
        {
            var result = new Wrapper<Employee>();

            if (string.IsNullOrEmpty(employee.FullName))
            {
                result.Success = false;
                result.Message = "Họ và tên không được để trống!";
                return result;
            }

            if (employee.Birthday == null)
            {
                result.Success = false;
                result.Message = "Ngày sinh không được để trống!";
                return result;
            }

            if (string.IsNullOrEmpty(employee.Phone))
            {
                result.Success = false;
                result.Message = "Số điện thoại không được để trống!";
                return result;
            }

            if (string.IsNullOrEmpty(employee.Email))
            {
                result.Success = false;
                result.Message = "Email không được để trống!";
                return result;
            }

            if (string.IsNullOrEmpty(employee.Password))
            {
                result.Success = false;
                result.Message = "Mật khẩu không được để trống!";
                return result;
            }

            if (employee.Role < 0) 
            {
                result.Success = false;
                result.Message = "Vai trò không được để trống!";
                return result;
            }

            if (db.Employees.Any(t => t.Email == employee.Email && t.Active == 1))
            {
                result.Success = false;
                result.Message = "Email đã tồn tại trong hệ thống!";
                return result;
            }

            if (db.Employees.Any(t => t.Phone == employee.Phone && t.Active == 1))
            {
                result.Success = false;
                result.Message = "Số điện thoại đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                employee.Active = 1;
                employee.CreatedAt = DateTime.Now;
                employee.UpdatedAt = DateTime.Now;
                db.Employees.Add(employee);
                db.SaveChanges();

                result.Success = true;
                result.Message = "Thêm dữ liệu thành công!";
                result.Data = employee;
            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Thêm dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }

        [Route("api/employee/{id}")]
        [HttpPut]
        public Wrapper<Employee> Put(int id, [FromBody] Employee employee)
        {
            var result = new Wrapper<Employee>();
            var existingEmployee = db.Employees.FirstOrDefault(t => t.Active == 1 && t.EmployeeID == id);

            if (existingEmployee == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            if (string.IsNullOrEmpty(employee.FullName))
            {
                result.Success = false;
                result.Message = "Họ và tên không được để trống!";
                return result;
            }

            if (employee.Birthday == null)
            {
                result.Success = false;
                result.Message = "Ngày sinh không được để trống!";
                return result;
            }

            if (string.IsNullOrEmpty(employee.Phone))
            {
                result.Success = false;
                result.Message = "Số điện thoại không được để trống!";
                return result;
            }

            if (string.IsNullOrEmpty(employee.Email))
            {
                result.Success = false;
                result.Message = "Email không được để trống!";
                return result;
            }

            if (string.IsNullOrEmpty(employee.Password))
            {
                result.Success = false;
                result.Message = "Mật khẩu không được để trống!";
                return result;
            }

            if (employee.Role < 0)
            {
                result.Success = false;
                result.Message = "Vai trò không được để trống!";
                return result;
            }

            if (db.Employees.Any(t => t.Email == employee.Email && t.Active == 1 && t.EmployeeID != id))
            {
                result.Success = false;
                result.Message = "Email đã tồn tại trong hệ thống!";
                return result;
            }

            if (db.Employees.Any(t => t.Phone == employee.Phone && t.Active == 1 && t.EmployeeID != id))
            {
                result.Success = false;
                result.Message = "Số điện thoại đã tồn tại trong hệ thống!";
                return result;
            }

            try
            {
                existingEmployee.FullName = employee.FullName;
                existingEmployee.Birthday = employee.Birthday;
                existingEmployee.Phone = employee.Phone;
                existingEmployee.Email = employee.Email;
                existingEmployee.Password = employee.Password;
                existingEmployee.Role = employee.Role;
                existingEmployee.UpdatedAt = DateTime.Now;

                db.SaveChanges();

                result.Success = true;
                result.Message = "Cập nhật dữ liệu thành công!";
                result.Data = existingEmployee;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = "Cập nhật dữ liệu không thành công! Lỗi: " + ex.Message;
                result.Data = existingEmployee;
            }

            return result;
        }

        [Route("api/employee/{id}")]
        [HttpDelete]
        public Wrapper<Employee> Delete(int id)
        {
            var result = new Wrapper<Employee>();
            var employee = db.Employees.FirstOrDefault(t => t.Active == 1 && t.EmployeeID == id);

            if (employee == null)
            {
                result.Success = false;
                result.Message = "Không tìm thấy dữ liệu!";
                return result;
            }

            try
            {
                employee.Active = 0;
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
