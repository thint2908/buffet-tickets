using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace quan_ly_don_hang.Areas.Admin.Controllers
{
    public class BuffetTicketController : Controller
    {
        // GET: Admin/BuffetTicket
        public ActionResult Index()
        {
            return View();
        }

        // GET: Admin/BuffetTicket/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Admin/BuffetTicket/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Admin/BuffetTicket/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Admin/BuffetTicket/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Admin/BuffetTicket/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Admin/BuffetTicket/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Admin/BuffetTicket/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
