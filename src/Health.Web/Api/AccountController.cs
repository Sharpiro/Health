using Microsoft.AspNetCore.Authorization;
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

        public async Task<IActionResult> AddTempUser()
        {
            var user = new IdentityUser { UserName = "testuser" };
            var password = "Password1!";
            var result = await _userManager.CreateAsync(user, password);
            var signInResult = _signInManager.IsSignedIn(User);
            if (signInResult)
                await _signInManager.SignOutAsync();
            else
                await _signInManager.SignInAsync(user, false);
            return result.Succeeded ? Ok($"Signed in: {signInResult}") : Ok(result.Errors);
        }

        public ActionResult Login()
        {
            //await _signInManager.SignInAsync();
            return Ok();
        }

        [Authorize]
        public async Task<ActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        public ActionResult GetData()
        {
            var result = _signInManager.IsSignedIn(User);
            var message = result ? $"signed in as {User.Identity.Name}" : "not signed in";
            return Ok(message);
        }
    }
}
