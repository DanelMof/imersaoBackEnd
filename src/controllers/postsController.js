// Importa as funções de manipulação de posts do modelo de dados
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
// Importa o módulo 'fs' para manipulação de arquivos
import fs from "fs";
// Importa a função para gerar descrições com o serviço Gemini
import gerarDescricaoComGemini from "../services/geminiService.js"

// Função para listar todos os posts
export async function listarPosts(req, res) {
    // Chama a função para buscar todos os posts do banco de dados
    const posts = await getTodosPosts();
    // Retorna uma resposta HTTP com status 200 (OK) contendo os posts em formato JSON
    res.status(200).json(posts);
}

// Função para criar um novo post a partir de dados enviados pelo cliente
export async function postarNovoPost(req, res) {
    // Captura o conteúdo do novo post do corpo da requisição
    const novoPost = req.body;
    try {
        // Chama a função para criar o post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Retorna o post criado em formato JSON e status 200 (OK)
        res.status(200).json(postCriado);  
    } catch (erro) {
        // Loga o erro no console em caso de falha
        console.error(erro.message);
        // Retorna uma resposta HTTP com status 500 (Erro Interno do Servidor) e mensagem de erro em JSON
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

// Função para fazer upload de uma imagem e criar um post associado
export async function uploadImagem(req, res) {
    // Cria um objeto de post inicial com os dados da imagem (nome original do arquivo)
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        // Chama a função para criar o post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Define o novo caminho da imagem, usando o ID do post criado como nome do arquivo
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo da imagem para o novo caminho
        fs.renameSync(req.file.path, imagemAtualizada);
        // Retorna o post criado em formato JSON e status 200 (OK)
        res.status(200).json(postCriado);  
    } catch (erro) {
        // Loga o erro no console em caso de falha
        console.error(erro.message);
        // Retorna uma resposta HTTP com status 500 (Erro Interno do Servidor) e mensagem de erro em JSON
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

// Função para atualizar um post existente com uma nova imagem e descrição
export async function atualizarNovoPost(req, res) {
    // Captura o ID do post a ser atualizado a partir dos parâmetros da URL
    const id = req.params.id;
    // Define a URL pública da imagem a partir do ID
    const urlImagem = `http://localhost:3000/${id}.png`;
    
    try {
        // Lê o arquivo da imagem correspondente ao ID do post
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        // Gera uma descrição para a imagem usando o serviço Gemini
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        // Cria um objeto de post atualizado com URL da imagem, descrição e atributo alt
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };

        // Chama a função para atualizar o post no banco de dados
        const postCriado = await atualizarPost(id, post);
        // Retorna o post atualizado em formato JSON e status 200 (OK)
        res.status(200).json(postCriado);  
    } catch (erro) {
        // Loga o erro no console em caso de falha
        console.error(erro.message);
        // Retorna uma resposta HTTP com status 500 (Erro Interno do Servidor) e mensagem de erro em JSON
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}
