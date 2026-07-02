namespace TodoApi
{
    public class TimeBlock
    {
        public int Id { get; set; }
        public int TarefaId { get; set; }
        public Tarefa? Tarefa { get; set; }
        public string Data { get; set; } = string.Empty;
        public string HoraInicio { get; set; } = string.Empty;
        public string HoraFim { get; set; } = string.Empty;
        public int TagId { get; set; }
        public Tag? Tag { get; set; }
    }
}
