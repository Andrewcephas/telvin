using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors("AllowAll");
app.UseStaticFiles(new StaticFileOptions {
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "../..")),
    RequestPath = ""
});

app.MapGet("/api/health", () => new { status = "healthy", service = "BlueTell API", timestamp = DateTime.UtcNow });

app.MapPost("/api/contact", (ContactModel contact) => {
    using var conn = new SQLiteConnection("Data Source=../../db/bluetell.db");
    conn.Open();
    using var cmd = new SQLiteCommand("INSERT INTO contacts (name, email, phone, subject, message) VALUES (@name, @email, @phone, @subject, @message)", conn);
    cmd.Parameters.AddWithValue("@name", contact.Name);
    cmd.Parameters.AddWithValue("@email", contact.Email);
    cmd.Parameters.AddWithValue("@phone", contact.Phone ?? "");
    cmd.Parameters.AddWithValue("@subject", contact.Subject);
    cmd.Parameters.AddWithValue("@message", contact.Message);
    cmd.ExecuteNonQuery();
    return Results.Json(new { success = true, message = "Message sent successfully" });
});

app.MapGet("/api/services", () => {
    var services = new List<object>();
    using var conn = new SQLiteConnection("Data Source=../../db/bluetell.db");
    conn.Open();
    using var cmd = new SQLiteCommand("SELECT * FROM services WHERE active = 1", conn);
    using var reader = cmd.ExecuteReader();
    while (reader.Read()) {
        services.Add(new {
            id = reader["id"],
            title = reader["title"],
            description = reader["description"],
            icon = reader["icon"]
        });
    }
    return Results.Json(services);
});

app.Run();

public record ContactModel(string Name, string Email, string? Phone, string Subject, string Message);
