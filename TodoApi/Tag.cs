using System;

namespace TodoApi
{
public class Tag
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
    public string Tipo { get; set; } = "kanban";
}
}