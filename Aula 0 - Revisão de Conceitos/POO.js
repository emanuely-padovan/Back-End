// REVISÃO DE CONCEITOS - PROGRAMAÇÃO ORIENTADA A OBJETOS
// NOME: Emanuely Macedo Padovan

// 1. Classe Simples -- Pessoa

class Pessoa {
    constructor (nome, idade) {
        this.nome = nome           // Criação de um objeto (tratando de um atributo dessa classe), para que possa ser instanciado...
        this.idade = idade
    }
    apresentar () {
        console.log (`Nome: ${this.nome} | Idade: ${this.idade}`)
    }
}

const pessoa1 = new Pessoa ("Emanuely", 17)
pessoa1.apresentar()

// 2. Classe Simples -- Produto

class Produto {
    constructor (nome, preco) {
        this.nome = nome
        this.preco = preco
    }
    mostrarPreco () {
        console.log(`Produto: ${this.nome} | Preço: ${this.preco}`)  // "this.preco.toFixed(2)"
    }
}

const produto1 = new Produto("Maçã", "R$19,90")  // 19.90
produto1.mostrarPreco()

// 3. Herança - Funcionário

class Funcionario {
    constructor (nome) {
        this.nome = nome
    }
}

class Gerente extends Funcionario{
    constructor (nome, setor) {
        super(nome)
        this.setor = setor
    }
    exibir () {
        console.log(`Nome: ${this.nome} | Setor: ${this.setor}`)
    }
}

const funcionario1 = new Gerente ("Aline", "Controle de Produção")
funcionario1.exibir()

// 4. Herança - Veículo

class Veiculo {
    constructor (marca){
        this.marca = marca
    }
}

class Carro extends Veiculo {
    constructor (marca, modelo) {
        super(marca)
        this.modelo = modelo
    }
    exibirDados (){
        console.log(`Marca: ${this.marca} | Modelo: ${this.modelo}`)
    }
}

const veiculo1 = new Carro ("Toyota", "Corolla")
veiculo1.exibirDados()

// 5. Encapsulamento - Conta

class Conta {
    #saldo
    constructor (){  // Iniciação de saldo será 0, então não é necessário receber um valor antes...
        this.#saldo = 0
    }
    depositar(valor) {
        if (valor > 0){
            this.#saldo += valor  // Aumentar o valor do saldo
        } else {
            console.log("Valor incorreto...")
        }
    }
    mostrarSaldo() {
        console.log(`Saldo atual: R$${this.#saldo.toFixed(2)}`)
    }
}

const conta1 = new Conta ()
conta1.depositar(1000)
conta1.mostrarSaldo()

conta1.depositar(50)
conta1.mostrarSaldo()

conta1.depositar(-30)
conta1.mostrarSaldo()

// 6. Encapsulamento - Aluno

class Aluno {
    #nota
    definirNota(nota){
        if (nota >= 0 && nota <= 10) {
            this.#nota = nota  // Como a nota não foi definida com um valor inicial, não é necessário colocar um "+"
        } else {
            console.log("Nota inválida!")
        }
    }
    mostrarNota(){
        console.log(`Nota: ${this.#nota.toFixed(1)}`)
    }
}

const aluno1 = new Aluno()
aluno1.definirNota(10)
aluno1.mostrarNota()