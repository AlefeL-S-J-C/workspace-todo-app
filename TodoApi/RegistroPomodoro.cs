namespace TodoApi
{
    public class RegistroPomodoro
    {
        public int Id { get; set; }
        public int TarefaId { get; set; }
        public Tarefa? Tarefa { get; set; }
        public string Data { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        public int CiclosCompletados { get; set; }
        public int TotalMinutos { get; set; }
    }
}
