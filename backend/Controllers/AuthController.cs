using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Task_Management.Services;
using BCrypt.Net;
using Task_management.Models.DTOs;
using Task_management.Models;
using Task_management.Data;

namespace Task_Management.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto userDto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == userDto.Email);
           if (userExists) 
    return BadRequest(new { error = "User already exists!" });

            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User Registered" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userDto)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (dbUser == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, dbUser.PasswordHash))
                return Unauthorized("Invalid Credentials");

            var token = TokenService.GenerateToken(dbUser, _config["Jwt:Key"]);
            return Ok(new { Token = token });
        }
    }
}
