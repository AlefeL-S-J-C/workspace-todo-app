namespace TodoApi
{
    public class RegistroHabito
    {
        public int Id { get; set; }
        public string Data { get; set; } = string.Empty;
        public bool Concluido { get; set; }
        public int HabitoId { get; set; }
        public Habito? Habito { get; set; }
    }
}
