from http import HTTPStatus
from apiflask import APIBlueprint
from app.schemas import ContaIn
from app.models import Conta
from app.services import ContaService


conta_bp = APIBlueprint('Conta', __name__, url_prefix='/conta')


@conta_bp.post('/')
@conta_bp.input(
    schema=ContaIn, 
    arg_name='conta_in', 
    example= {
        'nome': 'John Doe',
        'cpf': '12345678900',
        'data_nascimento': '2004-02-15',
        'tipo_conta': 1,
        'limite_saque_diario': 1000
    }
)
@conta_bp.output(ContaIn, status_code=HTTPStatus.CREATED)
def cadastrar_conta(conta_in: dict, conta_service: ContaService = ContaService()):
    ''' Endpoint para cadastrar uma conta. '''
    conta: Conta = Conta(conta_in.get('nome'), conta_in.get('cpf'), conta_in.get('data_nascimento'), 
        conta_in.get('tipo_conta'), conta_in.get('limite_saque_diario'))

    conta: Conta = conta_service.cadastrar(conta)

    return conta_in