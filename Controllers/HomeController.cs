using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text.RegularExpressions;

namespace SkodaChristmas2015.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Title = SkodaChristmas2015.Resources.ChristmasDefault.Title2;
            Dictionary<string, string> cultures = new Dictionary<string, string>();
            
            string[] culturesList = SkodaChristmas2015.Resources.ChristmasDefault.AvailableCultures.Split(',');
            foreach (var culture in culturesList)
            {
                string[] _culture = culture.Split(':');
                cultures.Add(_culture[0], _culture[1]);
            }
            ViewBag.cultures = cultures;


            string mainWish = SkodaChristmas2015.Resources.ChristmasDefault.MainPageWish;
            
            string[] strParts = Regex.Split(mainWish, "{");
            string[] iconsIDs = new string[strParts.Length];
            string[] wishList = new string[strParts.Length];
            string[] splitParts;
            for (int i = 0; i < strParts.Length; i++)
            {
                splitParts = Regex.Split(strParts[i], "}");
                iconsIDs[i] = splitParts[0];
                try
                {
                    wishList[i] = splitParts[1];
                }
                catch (Exception)
                {
                    iconsIDs[i] = "017";
                    wishList[i] = splitParts[0];
                }
                
                
            }

            ViewBag.mainWishList = wishList;
            ViewBag.mainWishIcons = iconsIDs;
            
            return View();
        }

        public ActionResult ChristmasCard(string id)
        {
            if (id != null)
            {
                ViewBag.Title = SkodaChristmas2015.Resources.ChristmasDefault.Title2;
                Dictionary<string, string> model = new Dictionary<string, string>();
                model.Add("id", id);
                return View(model);
            }
            else
            { return View(); }
        }

        public ActionResult Condition()
        {
            ViewBag.Title = SkodaChristmas2015.Resources.ChristmasDefault.Title2;

            return View();
        }

    }
}
