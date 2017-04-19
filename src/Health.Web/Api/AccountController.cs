using Health.Core;
using Health.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Health.Web.Api
{
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Register([FromBody]UserModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.Values);
            var identiyUser = new IdentityUser { UserName = user.Username };
            var createResult = await _userManager.CreateAsync(identiyUser, user.Password);
            if (!createResult.Succeeded)
            {
                Response.StatusCode = StatusCodes.Status401Unauthorized;
                return new JsonResult(RedirectMiddleware.Get401Result("Bad username/password"));
            }
            await _signInManager.SignInAsync(identiyUser, false);
            return new JsonResult(RedirectMiddleware.Get200Result(data: $"Signed in: {user.Username}"));
        }

        [HttpPost]
        public async Task<ActionResult> Login([FromBody]UserModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.Values);
            var signInResult = await _signInManager.PasswordSignInAsync(user.Username, user.Password, false, true);
            if (signInResult.Succeeded)
                return new JsonResult(RedirectMiddleware.Get200Result($"{user.Username} has been logged in"));
            Response.StatusCode = StatusCodes.Status401Unauthorized;
            return new JsonResult(RedirectMiddleware.Get401Result("Bad username/password"));
        }

        [HttpPut, Authorize]
        public async Task<ActionResult> Logout()
        {
            var user = User.Identity.Name;
            await _signInManager.SignOutAsync();
            return new JsonResult(RedirectMiddleware.Get200Result($"{user} has been logged out"));
        }

        [Authorize]
        public string GetUserInfo()
        {
            return User.Identity.Name;
            //var message = $"signed in as {User.Identity.Name}";
            //return new String(RedirectMiddleware.Get200Result(message));
        }

        [Authorize]
        public ActionResult GetData()
        {
            var claims = User.Claims;
            var message = $"signed in as {User.Identity.Name}";
            return new JsonResult(RedirectMiddleware.Get200Result(message));
        }
    }
}
