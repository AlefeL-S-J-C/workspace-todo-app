namespace TodoApi
{
    public class Habito
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Cor { get; set; } = "#22c55e";
        public int? TagId { get; set; }
        public Tag? Tag { get; set; }
        public List<RegistroHabito> Registros { get; set; } = new List<RegistroHabito>();
    }
}
