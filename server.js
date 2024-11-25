import express from "express"; // Importa o framework Express para criar a aplicação web
import routes from "./src/routes/postsRoutes.js"; // Importa as rotas definidas para os posts

const app = express(); // Cria uma nova instância da aplicação Express

// Configura o Express para servir arquivos estáticos a partir do diretório "uploads"
app.use(express.static("uploads"));

// Configura as rotas da aplicação usando a função "routes"
routes(app);

// Inicia o servidor na porta 3000 e exibe uma mensagem no console ao iniciar
app.listen(3000, () => {
    console.log("Servidor escutando..."); // Mensagem exibida quando o servidor começa a ouvir conexões
});
