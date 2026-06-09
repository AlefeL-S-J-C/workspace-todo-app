namespace TodoApi
{
    public class Urgencia
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string Prazo { get; set; } = string.Empty;
        public string Cor { get; set; } = string.Empty;
        public string Classe { get; set; } = string.Empty;
    }
}