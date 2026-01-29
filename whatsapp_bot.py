import pywhatkit as kit
import openpyxl
import requests
import re
import time


def buscar_endereco_por_cep(cep):
    cep = re.sub(r"\D", "", str(cep))

    if len(cep) != 8:
        return None

    try:
        r = requests.get(f"https://viacep.com.br/ws/{cep}/json/", timeout=10)
        dados = r.json()

        if dados.get("erro"):
            return None

        cidade = dados.get("localidade", "")
        uf = dados.get("uf", "")
        bairro = dados.get("bairro")

        if not bairro or not bairro.strip():
            bairro = cidade

        return {
            "bairro": bairro,
            "cidade": cidade,
            "uf": uf
        }

    except:
        return None


def enviar_mensagem(numero, mensagem):
   
    kit.sendwhatmsg_instantly(
        phone_no=f"+55{numero}",
        message=mensagem,
        wait_time=10,   
        tab_close=True,
        close_time=2
    )


def enviar_mensagens(caminho_planilha):
    wb = openpyxl.load_workbook(caminho_planilha)
    ws = wb.active

    cab = {cell.value.strip().lower(): i for i, cell in enumerate(ws[1])}

    for linha in ws.iter_rows(min_row=2):
        nome = linha[cab["cliente"]].value
        telefone = linha[cab["telefone"]].value
        servico = linha[cab["serviço"]].value
        produto = linha[cab["produto"]].value
        logradouro = linha[cab["logradouro"]].value
        numero = linha[cab["número"]].value
        cep = linha[cab["cep"]].value

        if not nome or not telefone or not cep:
            continue

        telefone = re.sub(r"\D", "", str(telefone))
        cep = re.sub(r"\D", "", str(cep))

        endereco = buscar_endereco_por_cep(cep)

        if not endereco:
            print(f"❌ Endereço não encontrado para {nome}")
            continue

        bairro = endereco["bairro"]
        cidade = endereco["cidade"]
        uf = endereco["uf"]

        mensagem = (
            f"Olá {nome}, tudo bem?\n\n"
            f"Estamos entrando em contato referente ao serviço de {servico}.\n\n"
            f"Produto: {produto}\n\n"
            f"Endereço:\n"
            f"{logradouro}, nº {numero}\n"
            f"{bairro} - {cidade}/{uf}\n"
            f"CEP: {cep}\n\n"
            f"Poderia confirmar, por gentileza, se as informações estão corretas?\n\n"
            f"Atenciosamente."
        )

        try:
            enviar_mensagem(telefone, mensagem)
            print(f"✅ Mensagem enviada para {nome}")
            time.sleep(15)  
        except Exception as e:
            print(f"❌ Erro ao enviar para {nome}: {e}")


if __name__ == "__main__":
    enviar_mensagens("agendamentos (5) (2).xlsx")
