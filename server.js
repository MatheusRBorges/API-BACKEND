
import express from 'express'
import pkg from '@prisma/client';
import cors from 'cors';

const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// Criar usuário
app.post('/usuarios', async (req, res) => {
  try {
    const usuario = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    });
    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar usuário.' });
  }
});

// Listar usuários
app.get('/usuarios', async (req, res) => {

    let users = [];
  if(req.query){
    users = await prisma.user.findMany({
      where:{
        name: req.query.name,
        email: req.query.email,
        age: req.query.age
      }
    })
 } else {
  users = await prisma.user.findMany()
 }

 

 res.status(200).json(users);
});


// Editar usuário
app.put('/usuarios/:id', async (req, res) => {
    try {
      const { email, name, age } = req.body;
      const { id } = req.params;
  
      // Verifica se já existe outro usuário com o mesmo e-mail
      const emailExistente = await prisma.user.findFirst({
        where: {
          email: email,
          NOT: { id: id }, // exclui o próprio usuário que está sendo atualizado
        },
      });
  
      if (emailExistente) {
        return res.status(400).json({ erro: 'Este e-mail já está em uso por outro usuário.' });
      }
  
      const usuarioAtualizado = await prisma.user.update({
        where: { id },
        data: { email, name, age },
      });
  
      res.status(200).json(usuarioAtualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao editar o usuário.' });
    }
  });

// Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar usuário.' });
  }
});

// Porta do servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});