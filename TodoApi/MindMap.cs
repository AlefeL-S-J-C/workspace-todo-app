namespace TodoApi
{
    public class MindMap
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Dados { get; set; } = "{\"nodes\":[],\"connections\":[]}";
        public int TagId { get; set; }
        public Tag? Tag { get; set; }
    }
}
