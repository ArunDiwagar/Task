using System;
using Microsoft.EntityFrameworkCore;
using Task_management.Models;

namespace Task_management.Data{

public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
       public DbSet<TaskItem> Tasks { get; set; }
    }
}