using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Task_management.Data;
using Task_management.Models;

namespace Task_management.Controllers
{
    [Authorize]
    [Route("api/task")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Get All Tasks
        [HttpGet]
        public IActionResult GetTasks() => Ok(_context.Tasks.ToList());

        // ✅ Create Task
        [HttpPost]
        public IActionResult CreateTask([FromBody] TaskItem task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return Ok(task);
        }

        // ✅ Update Task (Full Update)
        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, [FromBody] TaskItem task)
        {
            var existingTask = _context.Tasks.Find(id);
            if (existingTask == null) return NotFound();

            existingTask.Title = task.Title;
            existingTask.Status = task.Status;
            existingTask.Priority = task.Priority;
            _context.SaveChanges();
            return Ok(existingTask);
        }

        // ✅ Update Task Priority (Partial Update)
        [HttpPatch("{id}/priority")]
        public IActionResult UpdateTaskPriority(int id, [FromBody] JsonElement body)
        {
            var existingTask = _context.Tasks.Find(id);
            if (existingTask == null) return NotFound();

            if (body.TryGetProperty("priority", out var priority))
            {
                existingTask.Priority = priority.GetString();
                _context.SaveChanges();
                return Ok(existingTask);
            }

            return BadRequest("Invalid priority update request");
        }

        // ✅ Delete Task
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            return Ok("Task Deleted");
        }


    }
}
