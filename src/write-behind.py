from rgsync import RGJSONWriteBehind
from rgsync.Connectors import MongoConnection, MongoConnector
from rgsync.common import *
from datetime import datetime
import re

class CustomMongoConnector(MongoConnector):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def WriteData(self, data, dataKey):
        WriteBehindLog("WriteData CHAMADO")
        WriteBehindLog(f"Tipo dos dados recebidos: {type(data)}")
        WriteBehindLog(f"dataKey recebido: {dataKey}")
        WriteBehindLog(f"Dados originais: {data}")
                
        # Converter campos de data antes de salvar
        processed_data = []
        for item in data:
            if isinstance(item, dict) and 'value' in item:
                converted_value = self.convert_iso_strings_to_dates(item['value'])
                item['value'] = converted_value
            processed_data.append(item)
        
        # Chamar método da classe pai
        try:
            super().WriteData(processed_data, dataKey)  # Passa ambos parâmetros
            WriteBehindLog(f"WriteData pai executado com sucesso.")
        except Exception as e:
            WriteBehindLog(f"ERRO ao chamar WriteData pai: {e}")
            WriteBehindLog(f"Tipo do erro: {type(e)}")
            import traceback
            WriteBehindLog(f"Traceback: {traceback.format_exc()}")
            raise e

    def convert_iso_strings_to_dates(self, obj):        
        if isinstance(obj, dict):
            result = {}
            for key, value in obj.items():                
                # Processar campo 'redisgears' que contém JSON serializado
                if key == 'redisgears' and isinstance(value, str):
                    try:
                        import json
                        json_data = json.loads(value)                        
                        # Converter datas dentro do objeto JSON
                        converted_json = self.convert_dates_in_object(json_data)
                        # Reserializar para string JSON
                        result[key] = converted_json
                    except Exception as e:
                        WriteBehindLog(f"❌ ERRO ao processar JSON em {key}: {e}")
                        result[key] = value
                
                # Campos diretos que devem ser convertidos para Date
                elif key in ['createdAt', 'updatedAt', 'ttl'] and isinstance(value, str):
                    if self.is_iso_string(value):
                        try:
                            converted = self.parse_iso_date(value)
                            result[key] = converted
                        except Exception as e:
                            WriteBehindLog(f"Erro na conversão de {key}: {e}")
                            result[key] = value
                    else:
                        WriteBehindLog(f"Campo {key} não é ISO string válida")
                        result[key] = value
                else:
                    result[key] = value
            
            return result
        else:
            return obj

    def convert_dates_in_object(self, obj):
        """Converte datas em um objeto Python recursivamente"""
        
        if isinstance(obj, dict):
            result = {}
            for key, value in obj.items():
                if key in ['createdAt', 'updatedAt', 'ttl'] and isinstance(value, str):
                    if self.is_iso_string(value):
                        try:
                            converted = self.parse_iso_date(value)
                            result[key] = converted
                        except Exception as e:
                            result[key] = value
                    else:
                        result[key] = value
                elif isinstance(value, (dict, list)):
                    # processa objetos e arrays aninhados
                    result[key] = self.convert_dates_in_object(value)
                else:
                    result[key] = value
            return result
        elif isinstance(obj, list):
            # converte cada item da lista
            return [self.convert_dates_in_object(item) for item in obj]
        else:
            WriteBehindLog("Não houve conversão para dates in object")
            return obj

    def is_iso_string(self, value):
        iso_pattern = r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?'
        is_iso = bool(re.match(iso_pattern, value))
        return is_iso

    def parse_iso_date(self, iso_string):
        """Parse ISO string com múltiplas estratégias"""
        # Estratégia 1: Substituir Z por +00:00
        if iso_string.endswith('Z'):
            iso_string = iso_string[:-1] + '+00:00'
        
        # Estratégia 2: Tentar fromisoformat primeiro
        try:
            return datetime.fromisoformat(iso_string)
        except ValueError:
            pass
        
        # Estratégia 3: Usar strptime como fallback
        formats = [
            '%Y-%m-%dT%H:%M:%S.%f%z',  # Com milissegundos e timezone
            '%Y-%m-%dT%H:%M:%S%z',     # Sem milissegundos, com timezone  
            '%Y-%m-%dT%H:%M:%S.%f',    # Com milissegundos, sem timezone
            '%Y-%m-%dT%H:%M:%S',       # Sem milissegundos, sem timezone
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(iso_string, fmt)
            except ValueError:
                continue
        
        # Se nada funcionar, lança exceção
        raise ValueError(f"Não foi possível converter '{iso_string}' para datetime")
    
try:
    WriteBehindLog("Criando conexão MongoDB...")
    MONGODB_URL = 'mongodb://chatcord:27017'
    connection = MongoConnection('', '', '', '', MONGODB_URL)
    WriteBehindLog(f" Conexão criada: {connection}")
    WriteBehindLog(" Criando CustomMongoConnector...")
    db = 'chatcord'
    messageConnector = CustomMongoConnector(connection, db, 'room_messages', 'messageId')
    WriteBehindLog(f"CustomMongoConnector criado: {messageConnector}")
    WriteBehindLog("Configurando RGJSONWriteBehind...")
    RGJSONWriteBehind(GB, keysPrefix='message',
                      connector=messageConnector,
                      name='MessageWriteBehind',
                      version='99.99.99')
    
    WriteBehindLog("=============SCRIPT CONFIGURADO COM SUCESSO=============")

except Exception as e:
    WriteBehindLog(f" ERRO CRÍTICO na configuração: {e}")
    WriteBehindLog(f" Tipo do erro: {type(e)}")
    import traceback
    WriteBehindLog(f" Traceback completo: {traceback.format_exc()}")
