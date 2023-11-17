using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace quan_ly_don_hang.Areas.Admin.Controllers
{
    public class MenuItemController : Controller
    {
        // GET: Admin/MenuItem
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }

        public ActionResult Details()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }
    }
}