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
    public class OrderTaxController : ApiController
    {
        QuanLyDonHang db = new QuanLyDonHang();

        [Route("api/order-tax")]
        [HttpGet]
        public Wrapper<IEnumerable<OrderTax>> Get()
        {
            var orderTaxs = db.OrderTaxes.OrderByDescending(t => t.OrderTaxID).ToList();
            var result = new Wrapper<IEnumerable<OrderTax>>
            {
                Success = orderTaxs.Any(),
                Message = orderTaxs.Any() ? "" : "Không tìm thấy dữ liệu!",
                Data = orderTaxs
            };
            return result;
        }
    }
}
