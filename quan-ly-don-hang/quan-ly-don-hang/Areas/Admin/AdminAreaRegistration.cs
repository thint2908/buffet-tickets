using System.Web.Mvc;

namespace quan_ly_don_hang.Areas.Admin
{
    public class AdminAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Admin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {

            context.MapRoute(
                "Admin_default",
                "Admin/{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                new[] { "quan_ly_don_hang.Areas.Admin.Controllers" }
            );

            context.MapRoute(
                "Home_Register",
                "Admin/{controller}/{action}",
                new { controller = "Home", action = "Register" },
                new[] { "quan_ly_don_hang.Areas.Admin.Controllers" }
            );
            context.MapRoute(
                "Home_RecoveryPass",
                "Admin/{controller}/{action}",
                new { controller = "Home", action = "RecoveryPass" },
                new[] { "quan_ly_don_hang.Areas.Admin.Controllers" }
            );

            context.MapRoute(
                "Home_Login",
                "Admin/{controller}/{action}",
                new { controller = "Home", action = "Login" },
                new[] { "quan_ly_don_hang.Areas.Admin.Controllers" }
            );

            context.MapRoute(
                "Admin_Details",
                "Admin/MenuItem/Details",
                new { area = "Admin", controller = "MenuItem", action = "Details" }
            );

            context.MapRoute(
                "Admin_Create",
                "Admin/MenuItem/Create",
                new { area = "Admin", controller = "MenuItem", action = "Create" },
                new[] { "quan_ly_don_hang.Areas.Admin.Controllers" }
             );

            
        }
    }
}