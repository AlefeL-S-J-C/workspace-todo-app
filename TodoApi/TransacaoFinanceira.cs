namespace TodoApi
{
    public class TransacaoFinanceira
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = "Despesa";
        public string Categoria { get; set; } = "Outros";
        public string Data { get; set; } = string.Empty;
        public int TagId { get; set; }
        public Tag? Tag { get; set; }
    }
}
