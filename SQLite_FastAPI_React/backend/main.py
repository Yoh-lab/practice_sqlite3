import os
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
# from fastapi.responses import RedirectResponse
# from fastapi.responses import JSONResponse

dbfile = 'dbfile.db'  # SQLデータを保存するファイル

# 初めて実行した時、新たにテーブルを作っておく
if (not os.path.exists(dbfile)):
    with sqlite3.connect(dbfile) as conn:
        sql_create = '''
            create table kyaku (
                namae text,
                nenrei integer,
                primary key (namae)
            )
        '''
        conn.execute(sql_create)

app = FastAPI()
# app.mount(path="/stt", app=StaticFiles(directory='stt'))  # cssファイルを収める場所
# jintem = Jinja2Templates(directory='tem')  # jinja2テンプレートのhtmlファイルを収める場所

# 最初にfastapiからCORSMiddlewareを読み込んだあとに、
# URL別にアクセスできる権限を付与しています。
# origins = []の[]の中に、通信するreactなどのアプリのURLを記載しましょう。
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# インデックスページ


@app.get('/')
def index(request: Request):
    # return {"Hello": "World!"}
    with sqlite3.connect(dbfile) as conn:
        sql_select = '''
            select * from kyaku
        '''  # 全ての客のデータを取得する
        kyaku_lis = conn.execute(sql_select).fetchall()
        print(kyaku_lis)
        res = {'kyaku': kyaku_lis}
        return res

# 各データ表示と編集のページ


@app.get('/kyaku/{namae}')
def kyaku(data: dict):
    with sqlite3.connect(dbfile) as conn:
        namae = data["namae"]  # 名前
        sql_select = '''
            select * from kyaku where namae==?
        '''  # その名前を持つキャラのデータを取る
        kyaku = conn.execute(sql_select, [namae]).fetchone()
        if (kyaku):
            res = {
                "result": "success",
                "data": {
                    'namae': namae,
                    'nenrei': kyaku[1]
                }}
            return res
        else:
            res = {
                "result": "failed",
                "data": {

                    'error_message': 'このページは存在しない'
                }}
            # 存在しない名前が入れられる場合、エラーページへ
            return res

# 新しいデータ登録する処理


@app.post('/touroku')
async def touroku(data: dict):
    try:
        with sqlite3.connect(dbfile) as conn:
            print(data)
            namae = data["namae"]  # 名前
            nenrei = data["nenrei"]  # 年齢
            sql_insert = '''
                insert into kyaku (namae,nenrei)
                values (?,?)
            '''  # 新しいデータ追加
            conn.execute(sql_insert, (namae, nenrei))
        return {"result": "success"}
    except Exception as err:
        # param = {'request': request,
        #          'error_message': f'エラー：{type(err)} {err}'
        #          }
        print(type(err))
        return {"result": "failed"}
# データ更新する処理


@app.post('/koushin/{namae}')
async def koushin(data: dict):
    try:
        with sqlite3.connect(dbfile) as conn:
            namae_x = data["namae"]  # 新しい名前
            nenrei = data["nenrei"]  # 年齢
            sql_update = '''
                update kyaku set namae=?,nenrei=? where namae==?
            '''  # データ更新
            conn.execute(sql_update, (namae_x, nenrei, namae))
        # 完成したら新しい名前でデータ表示のページに戻る
        return {"result": "success"}
    except Exception as err:
        param = {'request': request,
                 'error_message': f'エラー：{type(err)} {err}'
                 }
        return {"result": "failed"}  # なにか間違いがある場合


# データ削除する処理

@app.post('/sakujo')
async def sakujo(request: Request):
    try:
        with sqlite3.connect(dbfile) as conn:
            form = await request.form()
            namae = form['namae']
            sql_delete = '''
                delete from kyaku where namae==?
            '''  # データ削除
            conn.execute(sql_delete, [namae])
        return {"result": "success"}  # インデックスページに戻る
    except Exception as err:
        param = {'request': request,
                 'error_message': f'エラー：{type(err)} {err}'
                 }
        return {"result": "failed"}  # なにか間違いがある場合

# データのダウンロード


# @app.get('/csv')
# def csv():
#     with sqlite3.connect(dbfile) as conn:
#         data = conn.execute('select * from kyaku').fetchall()  # 全部データを読み込む
#         data = '名前,年齢\n'+'\n'.join([d[0]+','+str(d[1])
#                                    for d in data])  # データをcsvに
#         header = {'Content-Disposition': 'attachment; filename=data.csv'}
#         return Response(content=data, headers=header, media_type='text/csv')
