using System.Collections.Generic;

namespace TodoApi
{
    public class Tarefa
    {
        public int Id { get; set; }
        public string Texto { get; set; } = string.Empty;
        public bool Concluida { get; set; }
        public string Status { get; set; } = string.Empty;
        public string DataInicio { get; set; } = string.Empty;
        public string DataFim { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int? UrgenciaId { get; set; }
        public Urgencia? Urgencia { get; set; }
        public int? TagId { get; set; }
        public Tag? Tag { get; set; }
        public List<Subtarefa> Subtarefas { get; set; } = new List<Subtarefa>();
    }
}