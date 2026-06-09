namespace TodoApi
{
    public class Tarefa
    {
        public int Id { get; set; }
        public string Texto { get; set; } = string.Empty;
        public bool Concluida { get; set; }
        public string DataInicio { get; set; } = string.Empty;
        public string DataFim { get; set; } = string.Empty;
        public string? Descricao { get; set; }

        public int UrgenciaId { get; set; }
        public Urgencia? Urgencia { get; set; }
    }
}