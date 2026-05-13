const ProdutoRepository = require('../repositories/ProdutoRepository')

class ProdutoService {
    async listarProdutos() {
        const listaProdutos = await ProdutoRepository.listarTodosProdutos()
        return {
            sucesso: true,
            dados: listaProdutos
        }
    }
    async buscarProdutoPorId(id) {
        if (!id || isNaN(id)) {
            // Retornar as excessões, como um status de erro
            throw {
                status: 400,
                mensagem: 'ID inválido!'
            }
        }

        const produto = await ProdutoRepository.buscarPorId(id)
        if (!produto) {
            throw {
                status: 404,
                mensagem: 'Produto não encontrado!'
            }
        }

        return {
            sucesso: true,
            dados: produto
        }
    }
    async cadastrarProduto(dados) {
        const {nome, descricao, preco, categoria, disponivel} = dados
        if (!nome || !descricao || preco === undefined){
            throw {
                status: 404,
                mensagem:'Os campos de nome, preço e descrição são obrigatórios.'
            }
        } 
        if(typeof preco !== 'number' || preco <= 0) {
            throw {
                status: 400,
                mensagem: 'Preço deve ser um número positivo.'
            }
        }

        const novoProduto = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: preco,
            categoria: categoria || null,
            disponivel: disponivel ?? true // Validar se é uma outra informação (o padrão - mesmo que não seja preenchido - é true - se estiver disponível)
        }
        const id = await ProdutoRepository.cadastrarNovoProduto(novoProduto)
        return {
            sucesso: true,
            mensagem: 'Produto cadastrado!',
            id
        }
    }
    async atualizarProduto(id, dados) {
        if (!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: 'ID inválido!'
            }
        }
        const produto = await ProdutoRepository.buscarPorId(id)
        if(!produto) {
            throw {
                status: 404,
                mensagem: 'Produto não encontrado.'
            }
        }
        const produtoAtualizado = {}
        const {nome, descricao, preco, categoria, disponivel} = dados

        if (nome !== undefined) produtoAtualizado.nome = nome.trim()
        if (descricao !== undefined) produtoAtualizado.descricao = descricao.trim()
        if (preco !== undefined) {
            if(typeof preco !== 'number' || preco <= 0) {
                throw {
                    status: 400,
                    mensagem: 'Preço deve ser um número maior que zero.'
                }
            }
            produtoAtualizado.preco = preco
        }
        if (categoria !== undefined) produtoAtualizado.categoria = categoria
        if (disponivel !== undefined) produtoAtualizado.disponivel = disponivel

        if (Object.keys(produtoAtualizado).length === 0) {
            throw {
                status: 400,
                mensagem: 'Nenhum dado para atualizar.'
            }
        }

        await ProdutoRepository.atualizarProdutoporId(id, produtoAtualizado)
        return {
            sucesso: true,
            mensagem: 'Produto atualizado.'
        }
    }
    async deletarProduto(id) {
        if(!id || isNaN(id)) {
            throw{
                status: 400,
                mensagem: 'ID inválido.'
            }
        }
        const produto = await ProdutoRepository.buscarPorId(id)
        if(!produto) {
            throw {
                status: 404,
                mensagem: 'Produto não encontrado.'
            }
        }
        await ProdutoRepository.deletarProdutoPorId()
        return {
            sucesso: true, 
            mensagem: 'Produto deletado.'
        }
    }
}

module.exports = new ProdutoService()