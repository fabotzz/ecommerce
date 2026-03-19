const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

console.log('Conectando ao MongoDB...');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(async () => {
    console.log('MongoDB conectado!');
    
    // Criar schema e modelo
    const produtoSchema = new mongoose.Schema({
      nome: { type: String, required: true },
      preco: { type: Number, required: true },
      descricao: String,
      categoria: String,
      emEstoque: { type: Boolean, default: true }
    });
    
    const Produto = mongoose.model('Produto', produtoSchema);
    
    // Inserir produtos de exemplo se o banco estiver vazio
    const count = await Produto.countDocuments();
    if (count === 0) {
      console.log('Inserindo produtos de exemplo...');
      await Produto.insertMany([
        { 
          nome: 'Camiseta Básica', 
          preco: 49.90, 
          descricao: 'Camiseta 100% algodão, confortável e durável',
          categoria: 'Vestuário'
        },
        { 
          nome: 'Calça Jeans', 
          preco: 129.90, 
          descricao: 'Calça jeans azul clara, modelo reto',
          categoria: 'Vestuário'
        },
        { 
          nome: 'Tênis Esportivo', 
          preco: 199.90, 
          descricao: 'Tênis para corrida, amortecimento avançado',
          categoria: 'Calçados'
        },
        { 
          nome: 'Smartphone XYZ', 
          preco: 1299.90, 
          descricao: 'Smartphone com câmera de 48MP e 128GB',
          categoria: 'Eletrônicos'
        }
      ]);
      console.log('Produtos de exemplo inseridos!');
    }

    // ROTAS DA API
    
    // Rota inicial
    app.get('/', (req, res) => {
      res.json({ 
        mensagem: 'API do E-commerce funcionando!',
        endpoints: {
          produtos: '/api/produtos',
          produtosPorId: '/api/produtos/:id',
          categorias: '/api/categorias'
        }
      });
    });

    // Listar todos os produtos
    app.get('/api/produtos', async (req, res) => {
      try {
        const produtos = await Produto.find();
        res.json(produtos);
      } catch (error) {
        res.status(500).json({ erro: error.message });
      }
    });

    // Buscar produto por ID
    app.get('/api/produtos/:id', async (req, res) => {
      try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
          return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        res.json(produto);
      } catch (error) {
        res.status(500).json({ erro: error.message });
      }
    });

    // Criar novo produto
    app.post('/api/produtos', async (req, res) => {
      try {
        const produto = new Produto(req.body);
        await produto.save();
        res.status(201).json(produto);
      } catch (error) {
        res.status(400).json({ erro: error.message });
      }
    });

    // Atualizar produto
    app.put('/api/produtos/:id', async (req, res) => {
      try {
        const produto = await Produto.findByIdAndUpdate(
          req.params.id, 
          req.body, 
          { new: true }
        );
        res.json(produto);
      } catch (error) {
        res.status(400).json({ erro: error.message });
      }
    });

    // Deletar produto
    app.delete('/api/produtos/:id', async (req, res) => {
      try {
        await Produto.findByIdAndDelete(req.params.id);
        res.json({ mensagem: 'Produto removido com sucesso' });
      } catch (error) {
        res.status(400).json({ erro: error.message });
      }
    });

    // Listar categorias únicas
    app.get('/api/categorias', async (req, res) => {
      try {
        const categorias = await Produto.distinct('categoria');
        res.json(categorias);
      } catch (error) {
        res.status(500).json({ erro: error.message });
      }
    });

    // Iniciar servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`   Servidor rodando em http://localhost:${PORT}`);
      console.log(`   Endpoints disponíveis:`);
      console.log(`   GET  http://localhost:${PORT}/api/produtos`);
      console.log(`   GET  http://localhost:${PORT}/api/produtos/[ID]`);
      console.log(`   POST http://localhost:${PORT}/api/produtos`);
      console.log(`   PUT  http://localhost:${PORT}/api/produtos/[ID]`);
      console.log(`   DELETE http://localhost:${PORT}/api/produtos/[ID]`);
      console.log(`   GET  http://localhost:${PORT}/api/categorias`);
    });
  })
  .catch(err => {
    console.log('Erro no MongoDB:', err.message);
    process.exit(1);
  });