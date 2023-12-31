﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace quan_ly_don_hang
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "AdminMenuItemCreate",
                url: "Admin/MenuItem/Create",
                defaults: new { area = "Admin", controller = "MenuItem", action = "Create" },
                new[] { "quan_ly_don_hang.Controllers" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                new[] { "quan_ly_don_hang.Controllers" }
            );

        }
    }
}
