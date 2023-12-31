export enum TipoConta {
  CONTA_CORRENTE = 1,
  CONTA_POUPANCA = 2,
  CONTA_SALARIO = 3,
  CONTA_PAGAMENTO = 4
}

class Pessoa {
  id: number;
  nome: string;
  cpf: string;
  data_nascimento: Date

  public constructor(
    id: number, 
    nome: string,
    cpf: string,
    data_nascimento: string
  ) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.data_nascimento = new Date(data_nascimento);
  }
}

export class Conta {
  id: number;
  saldo: number;
  fl_ativo: boolean;
  limite_saque_diario: number;
  pessoa: Pessoa;
  tipo_conta: TipoConta;

  public constructor(
    id: number, saldo: number, fl_ativo: boolean, 
    limite_saque_diario: number, pessoa: Pessoa, tipo_conta: TipoConta
  ) {
    this.id = id;
    this.saldo = saldo;
    this.fl_ativo = fl_ativo;
    this.limite_saque_diario = limite_saque_diario;
    this.pessoa = pessoa;
    this.tipo_conta = tipo_conta;
  }
}