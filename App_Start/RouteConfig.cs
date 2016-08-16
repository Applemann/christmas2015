using SkodaChristmas2015.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace SkodaChristmas2015
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                name: "Mobile",
                url: "skodajis",
                defaults: new { culture = CultureHelper.GetDefaultCulture(), controller = "Mobile", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "CultureMobile",
                url: "{culture}/skodajis",
                defaults: new { culture = CultureHelper.GetDefaultCulture(), controller = "Mobile", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Default",
                url: "{culture}/{controller}/{action}/{id}",
                defaults: new { culture = CultureHelper.GetDefaultCulture(), controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "ChristmasCard",
                url: "{culture}/{controller}/{action}/{id}",
                defaults: new { culture = CultureHelper.GetDefaultCulture(), controller = "Home", action = "ChristmasCard", id = UrlParameter.Optional }
            );

        }
    }
}
