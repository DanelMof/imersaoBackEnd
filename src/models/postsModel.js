import 'dotenv/config';
import { ObjectId } from "mongodb"; // Importa a classe ObjectId para manipulação de IDs no MongoDB
import conectarAoBanco from "../config/dbConfig.js"; // Importa a função para conectar ao banco de dados

// Conecta ao banco de dados utilizando a string de conexão especificada na variável de ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para buscar todos os posts do banco de dados
export async function getTodosPosts() {
    // Seleciona o banco de dados "imersao-instabytes"
    const db = conexao.db("imersao-instabytes");
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");
    // Retorna um array com todos os documentos da coleção "posts"
    return colecao.find().toArray();
}

// Função assíncrona para criar um novo post no banco de dados
export async function criarPost(novoPost) {
    // Seleciona o banco de dados "imersao-instabytes"
    const db = conexao.db("imersao-instabytes");
    // Seleciona a coleção "posts"
    const colecao = db.collection("posts");
    // Insere o novo post na coleção e retorna o resultado da inserção
    return colecao.insertOne(novoPost);
}

// Função assíncrona para atualizar um post existente no banco de dados
export async function atualizarPost(id, novoPost) {
    // Seleciona o banco de dados "imersao-instabytes"
    const db = conexao.db("imersao-instabytes");
    // Seleciona a coleção "posts"
    const colecao = db.collection("posts");
    // Converte o ID fornecido para o formato ObjectId necessário para o MongoDB
    const objID = ObjectId.createFromHexString(id);
    // Atualiza o documento com o ID especificado, substituindo os campos com o conteúdo de novoPost
    return colecao.updateOne({ _id: new ObjectId(objID) }, { $set: novoPost });
}
