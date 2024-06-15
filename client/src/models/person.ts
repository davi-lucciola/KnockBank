export class Person {
  id: number;
  name: string;
  cpf: string;
  birthDate: Date

  public constructor(
    id: number, 
    name: string,
    cpf: string,
    birthDate: string
  ) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.birthDate = new Date(birthDate);
  }
}