from http import HTTPStatus
from apiflask import APIBlueprint
from app.security import auth
from app.services import ContaService
from app.models import Conta
from app.schemas import Response, ContaIn, ContaOut


conta_bp = APIBlueprint('Conta', __name__, url_prefix='/conta')


@conta_bp.get('/me')
@conta_bp.auth_required(auth)
@conta_bp.output(ContaOut)
def buscar_conta_logada():
    return auth.current_user.conta.to_json()

@conta_bp.post('/')
@conta_bp.input(ContaIn, arg_name='conta_in')
@conta_bp.output(Response, status_code=HTTPStatus.CREATED)
def cadastrar_conta(conta_in: dict, conta_service: ContaService = ContaService()):
    ''' Endpoint para cadastrar uma conta. '''
    conta: Conta = Conta(conta_in.get('nome'), conta_in.get('cpf'), conta_in.get('data_nascimento'), 
        conta_in.get('senha'), conta_in.get('tipo_conta'), conta_in.get('limite_saque_diario'))

    conta: Conta = conta_service.cadastrar(conta)
    return {
        'message': 'Conta cadastrada com sucesso.',
        'detail': {
            'created_id': conta.id
        }
    }