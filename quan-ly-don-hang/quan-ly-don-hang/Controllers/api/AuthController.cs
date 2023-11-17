using quan_ly_don_hang.Context;
using quan_ly_don_hang.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.UI.WebControls;
using BCryptNet = BCrypt.Net.BCrypt;
namespace quan_ly_don_hang.Controllers.api
{
    public class AuthController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        //đăng nhập
        [Route("api/login")]
        [HttpPost]
        public Wrapper<Employee> Login([FromBody] Employee employee)
        {
            var result = new Wrapper<Employee>();
            var emp = db.Employees.FirstOrDefault(t => t.Email == employee.Email);

            try
            {
                if (emp == null)
                {
                    result.Success = false;
                    result.Message = "Tài khoản không tồn tại, vui lòng thử lại!";
                    result.Data = null;
                    return result;
                }
                if (BCryptNet.Verify(employee.Password, emp.Password.ToString()))
                {
                    result.Success = true;
                    result.Message = "Đăng nhập thành công!";
                    result.Data = emp;
                }
                else
                {
                    result.Success = false;
                    result.Message = "Mật khẩu không đúng. Vui lòng thử lại!";
                    result.Data = emp;
                }

            }
            catch (Exception ex)
            {
                result.Success = true;
                result.Message = "Đăng nhập không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }

            return result;
        }


        //đăng kí tài khoản
        [Route("api/register")]
        [HttpPost]
        public Wrapper<Employee> Register([FromBody] Employee employee)
        {
            var result = new Wrapper<Employee>();
            var emp = db.Employees.FirstOrDefault(t => t.Email == employee.Email);
            var empPhone = db.Employees.FirstOrDefault(t => t.Phone == employee.Phone);

            try
            {
                if (emp != null)
                {
                    result.Success = false;
                    result.Message = "Email đã tồn tại! Vui lòng sử dụng email khác!";
                    result.Data = null;

                    return result;
                }
                else if(empPhone != null)
                {
                    result.Success = false;
                    result.Message = "Số điện thoại đã tồn tại! Vui lòng sử dụng số điện thoại khác khác!";
                    result.Data = null;

                    return result;
                }
                else
                {
                    var newEmp = new Employee
                    {
                        FullName = employee.FullName,
                        Email = employee.Email,
                        Birthday = employee.Birthday,
                        Phone = employee.Phone,
                        Password = BCryptNet.HashPassword(employee.Password),
                        Role = 2,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                    };

                    result.Data = newEmp;
                    result.Success = true;
                    result.Message = "Đăng kí tài khoản thành công!";
                    db.Employees.Add(newEmp);
                    db.SaveChanges();
                }
            }
            catch(Exception ex)
            {
                result.Success = false;
                result.Message = "Đăng kí tài khoản không thành công! Lỗi: " + ex.Message;
                result.Data = null;
            }
            return result;
        }
    }
}
