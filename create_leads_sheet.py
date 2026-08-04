import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
import requests
requests.packages.urllib3.disable_warnings()
old_request = requests.Session.request
def new_request(self, method, url, **kwargs):
    kwargs['verify'] = False
    return old_request(self, method, url, **kwargs)
requests.Session.request = new_request
import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ['https://www.googleapis.com/auth/drive.file']

def create_google_sheet():
    creds = None
    if os.path.exists('token_drive.json'):
        creds = Credentials.from_authorized_user_file('token_drive.json', SCOPES)
        
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists('credentials.json'):
                print("Error: Falta credentials.json")
                return
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0, open_browser=False)
            
        with open('token_drive.json', 'w') as token:
            token.write(creds.to_json())

    try:
        import httplib2
        import google_auth_httplib2
        http = httplib2.Http(disable_ssl_certificate_validation=True)
        authed_http = google_auth_httplib2.AuthorizedHttp(creds, http=http)
        service = build('drive', 'v3', http=authed_http)
        
        file_path = "Leads_Descargas_PARDE.csv"
        
        file_metadata = {
            'name': 'Leads Descargas PARDE',
            'mimeType': 'application/vnd.google-apps.spreadsheet'
        }
        
        media = MediaFileUpload(file_path, mimetype='text/csv', resumable=True)

        # Crear uno nuevo
        file = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
        file_id = file.get('id')
        link = file.get('webViewLink')
        
        print(f"Éxito: Google Sheet creado correctamente.")
        print(f"ID del archivo: {file_id}")
        print(f"ENLACE PARA ABRIR EL SHEET: {link}")
            
    except Exception as error:
        print(f"Ocurrió un error con la API de Drive: {error}")

if __name__ == '__main__':
    create_google_sheet()
