namespace TodoApi
{
    public class Anotacao
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string ImagemBase64 { get; set; } = string.Empty;
        public string Conteudo { get; set; } = string.Empty;
        public string TipoFolha { get; set; } = "paper-blank";
        public string Tipo { get; set; } = "canvas";
        public int TagId { get; set; }
        public Tag? Tag { get; set; }
    }
}
