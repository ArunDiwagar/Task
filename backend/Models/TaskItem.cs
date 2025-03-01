using System;

namespace Task_management.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Status { get; set; } // Not Started, In Progress, Completed
        public string Priority { get; set; } // None, Low, Medium, High, Urgent
        
    }
}
