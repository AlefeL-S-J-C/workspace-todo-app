using System.Text.Json.Serialization;

namespace TodoApi
{
    public class Subtarefa
    {
        public int Id { get; set; }
        public string Texto { get; set; } = string.Empty;
        public bool Concluida { get; set; } = false;
        public int TarefaId { get; set; }

        [JsonIgnore]
        public Tarefa? Tarefa { get; set; }
    }
}