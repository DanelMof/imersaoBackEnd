import express from "express"; // Importa o framework Express para criar e configurar a aplicação web
import multer from "multer"; // Importa o Multer, um middleware para lidar com uploads de arquivos
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; // Importa as funções controladoras para realizar as operações com posts
import cors from "cors"; // Importa o CORS para habilitar o compartilhamento de recursos entre origens diferentes

// Configurações de CORS para permitir solicitações do frontend hospedado em localhost:8000
const corsOptions = {
  origin: "http://localhost:8000", // Define a origem permitida
  optionsSuccessStatus: 200 // Define o status de resposta para solicitações de sucesso
};

// Configuração do armazenamento de arquivos com o Multer
const storage = multer.diskStorage({
  // Define o diretório de destino dos arquivos enviados
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Substitua por outro diretório se necessário
  },
  // Define o nome do arquivo salvo
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Mantém o nome original; use nomes únicos em produção para evitar conflitos
  }
});

// Cria uma instância do middleware Multer com as configurações de armazenamento
const upload = multer({ storage: storage });

// Função para definir as rotas da API
const routes = (app) => {
  // Configura o Express para interpretar corpos de requisições no formato JSON
  app.use(express.json());
  // Aplica as configurações de CORS à aplicação
  app.use(cors(corsOptions));

  // Define rota GET para recuperar todos os posts
  app.get("/posts", listarPosts); // Rota chama a função controladora 'listarPosts'

  // Define rota POST para criar um novo post
  app.post("/posts", postarNovoPost); // Rota chama a função controladora 'postarNovoPost'

  // Define rota POST para upload de uma imagem, assumindo que o nome do campo é "imagem"
  app.post("/upload", upload.single("imagem"), uploadImagem); // Rota chama a função controladora 'uploadImagem'

  // Define rota PUT para atualizar um post existente com base no ID, fornecendo novos dados
  app.put("/upload/:id", atualizarNovoPost); // Rota chama a função controladora 'atualizarNovoPost'
};

// Exporta as rotas para serem usadas na aplicação principal
export default routes;
