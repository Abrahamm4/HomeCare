using HomeCareApi.Models;
using HomeCareApi.Models.Dto;
using HomeCareApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HomeCare.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : HomeCareApi.Controllers.BaseApiController
    {
        private readonly UserManager<AuthUser> _userManager;
        private readonly SignInManager<AuthUser> _signInManager;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;
        private readonly UserLinkingService _userLinkingService;

        public AuthController(
            UserManager<AuthUser> userManager,
            SignInManager<AuthUser> signInManager,
            IConfiguration config,
            ILogger<AuthController> logger,
            UserLinkingService userLinkingService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _logger = logger;
            _userLinkingService = userLinkingService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = new AuthUser
            {
                UserName = dto.Username,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequestProblem(detail: string.Join("; ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "Patient");
            // Auto create Patient profile linked to the Identity user
            await _userLinkingService.CreatePatientProfileAsync(user);

            // Return JWT as normal
            var token = await GenerateJwtTokenAsync(user);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Username);

            if (user == null)
                return UnauthorizedProblem(detail: "Invalid username or password.");

            if (!await _userManager.CheckPasswordAsync(user, dto.Password))
                return UnauthorizedProblem(detail: "Invalid username or password.");

            var token = await GenerateJwtTokenAsync(user);
            return Ok(new { token });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok("Logged out.");
        }

        private async Task<string> GenerateJwtTokenAsync(AuthUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var userRoles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
 {
 new Claim(ClaimTypes.Name, user.UserName!),
 new Claim(ClaimTypes.NameIdentifier, user.Id!)
 };
 foreach (var role in userRoles)
 {
 claims.Add(new Claim(ClaimTypes.Role, role));
 }
 var token = new JwtSecurityToken(
 issuer: _config["Jwt:Issuer"],
 audience: _config["Jwt:Audience"],
 claims: claims,
 expires: DateTime.Now.AddHours(4),
 signingCredentials: creds
 );
 return new JwtSecurityTokenHandler().WriteToken(token);
 }
 }
}
